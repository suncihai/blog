<?php
/**
 script usage:
 php lang.php			- scan current work directory and generate text file for translate
 php lang.php json		- scan current work directory and generate the last empty Json file
 php lang.php merge		- translate language text file into Json format file
 **/

$lang = array();
ini_set('date.timezone', 'Asia/Hong_Kong');

$SKIP_PATH = array(
	'docs',
	'node_modules',
	'sugar',
	'resources',
	'plugins',
	'lang'
);

function is_skip($path){
	global $SKIP_PATH;
	foreach ($SKIP_PATH as $item) {
		$len = strlen($item)+1;
		$last = substr($path, -$len);
		if ($last == ('/'.$item)){
			return true;
		}
	}
	return false;
}

function run_js($dir){
	global $no;
	$dh = opendir($dir);
	while (($file = readdir($dh)) !== false) {
		if ($file == '..' || $file == '.') continue;
		$path = $dir . '/' . $file;
		if (is_skip($path)){
			continue;
		}
		if (!is_file($path)){
			run_js($path);
			continue;
		}

		$ext = strrchr($file, '.');
		if (strtolower($ext) != '.js') continue;
		// 只JS文件替换
		match_js($path);
	}
	closedir($dh);
}

function run_html($dir){
	global $no;
	$dh = opendir($dir);
	while (($file = readdir($dh)) !== false) {
		if ($file == '..' || $file == '.') continue;
		$path = $dir . '/' . $file;
		if (is_skip($path)){
			continue;
		}
		if (!is_file($path)){
			run_html($path);
			continue;
		}

		$ext = strrchr($file, '.');
		if (strtolower($ext) != '.html') continue;
		// 只JS文件替换
		match_html($path);
	}
	closedir($dh);
}

function match_js($path){
	global $lang;
	$count = 0;
	$cont = file_get_contents($path);
	if (preg_match_all('/T\("(.+?)"(?:,[^"\)]+)?\)/', $cont, $matchs, PREG_SET_ORDER)){
		foreach ($matchs as $m) {
			if (isset($lang[$m[1]])) continue;
			$lang[$m[1]] = substr($m[0], 5, -1);
			$count++;
		}
	}
	if (preg_match_all('/T\(\'(.+?)\'(?:,[^\'\)]+)?\)/', $cont, $matchs, PREG_SET_ORDER)){
		foreach ($matchs as $m) {
			if (isset($lang[$m[1]])) continue;
			$lang[$m[1]] = substr($m[0], 5, -1);
			$count++;
		}
	}
	if (preg_match_all('/_T\([\'"](.+?)[\'"]\)/', $cont, $matchs, PREG_SET_ORDER)){
		foreach ($matchs as $m) {
			if (isset($lang[$m[1]])) continue;
			$lang[$m[1]] = substr($m[0], 3, -1);
			$count++;
		}
	}
	echo "Process: {$path} - {$count}\n";
}

function match_html($path){
	global $lang;
	$count = 0;
	$cont = file_get_contents($path);
	if (preg_match_all('/\{\% (.+?) \%\}/', $cont, $matchs, PREG_SET_ORDER)){
		foreach ($matchs as $m) {
			if (isset($lang[$m[1]])) continue;
			$lang[$m[1]] = $m[1];
			$count++;
		}
	}
	echo "Process: {$path} - {$count}\n";
}

//header('content-type:text/html; charset=UTF-8');
//echo json_encode($lang);

$cwd = getcwd();
echo "Current Directory: {$cwd}\n";

$date = date('Ymd');
if (in_array('merge', $argv)){
	$file = false;
	foreach ($argv as $param) {
		if ($param == 'merge'){
			$file = true;
		}elseif ($file === true){
			$file = $param;
			break;
		}
	}
	if (!$file || $file === true || !file_exists($file)){
		echo 'language file not exists!';
		exit;
	}

	// 读入字典
	$lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	$maps = array();
	while (count($lines)){
		$line = array_shift($lines);
		if (!preg_match('/^[0-9a-f]{16}/i', $line)){ continue; }
		$key = substr($line, 0, 16);
		$line = array_shift($lines);
		if (!empty($line)){
			$maps[$key] = trim($line);
		}
	}

	run_js($cwd);
	run_html($cwd);

	// 匹配替换翻译
	$translated = 0;
	$miss = 0;
	$json = "{\"success\":true,\"result\":{\r\n";
	$data = "ID ;描述\r\n待翻译语句\r\n\r\n";
	foreach ($lang as $key => $value) {
		$hash = substr(md5($key), 8, 16);
		if (isset($maps[$hash])){
			$key = addcslashes($key, "\\\r\n\"\t");
			$value = addcslashes($maps[$hash], "\\\r\n\"\t");
			$json .= " \"{$key}\":\"{$value}\",\r\n";
			$translated++;
		}else {
			$data .= "{$hash} -  {$value}\r\n{$key}\r\n\r\n";
			$miss++;
		}
	}
	$json .= "}}";

	echo "----------------------------------\n";
	echo 'Load language translate count: '. count($maps)."\n";
	echo "Translated count: {$translated}, Miss translate count: {$miss}\n";

	if ($translated){
		$file = "translate_{$date}.json";
		file_put_contents($file, $json);
		echo "Translate JSON File: {$file}\n";
	}
	if ($miss){
		$file = "miss_{$date}.txt";
		file_put_contents($file, $data);

		echo "Miss Translate File: {$file}\n";
	}

}elseif (in_array('json', $argv)){
	run_js($cwd);
	run_html($cwd);

	$json = "{\r\n";
	foreach ($lang as $key => $value) {
		$key = addcslashes($key, "\r\n\"'\t");
		$value = addcslashes($value, "\\\r\n\t");

		$json .= "\t\"{$key}\": \"\",\r\n";
	}
	$json .= "}";
	$file = "lang_{$date}.json";
	file_put_contents($file, $json);

	echo "JSON File: {$file}\n";
	echo "T TAG COUNT: ".count($lang)."\n";

}else {
	run_js($cwd);
	run_html($cwd);

	$data = "ID ;描述\r\n待翻译语句\r\n\r\n";
	foreach ($lang as $key => $value) {
		$hash = substr(md5($key), 8, 16);
		$data .= "{$hash} -  {$value}\r\n{$key}\r\n\r\n";
	}
	$file = "lang_{$date}.txt";
	file_put_contents($file, $data);

	echo "TRANSLATE File: {$file}\n";
	echo "T TAG COUNT: ".count($lang)."\n";
}

?>
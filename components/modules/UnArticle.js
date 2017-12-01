import styled from 'styled-components'

import ComponentIcon from './Icon'

const UnArticle = styled.div`
    padding-top: 4em;
    text-align: center;
    > i {
        font-size: 3rem;
    }
    > p {
        font-size: 2rem;
    }
`

export default () => (
    <UnArticle>
        <ComponentIcon type="nodata" />
        <p>文章不存在，地址输入有误或者已被删除。</p>
    </UnArticle>
)

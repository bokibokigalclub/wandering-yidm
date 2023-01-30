const $result = $('#result');
const $message = $('#message');
const $input = $('#input');
const $button = $('#start-search');
let allowSearch = false;
let catalogData = [], $fuse, $fuseIndex;
const fuseCfg = {includeScore: true, minMatchCharLength: 3, keys: ["name", "desc", "tags"]}


$result.html('<p>本地搜索正在初始化</p>')

$.ajax({
    method: 'GET',
    url: '/catalog.json',
    dataType: 'json',
    success: function (data) {
        catalogData = data;
        allowSearch = true;
        $result.html('<p>本地搜索已初始化</p>')
        $fuseIndex = Fuse.createIndex(fuseCfg.keys, data)
        $fuse = new Fuse(data, fuseCfg, $fuseIndex)
        console.log('Initialized search engine Fuse.');
    }
});

const subRenderTags = (tags) => {
    return tags.map(tag => `<a class="a-tag" href="/tags/${tag}/" title="${tag}">${tag}</a><span>&nbsp;</span>`)
}

const renderResultItem = (aid, name, tags, desc) =>
`<div class="post-container">
    <p class="post-title"><a href="/${aid}/">${name}</a></p>
    <p class="post-meta">
        <span class="meta-item">
            <i class="fa fa-tag"></i>
            <span>&nbsp;</span>
            ${subRenderTags(tags)}
        </span>
    </p>
    <p class="post-abstract">${desc}</p>
</div>`

const renderRawSearchResult = res => {
    if (res.length === 0) return '<p>什么也没有找到……</p>'
    return res.map(item => {
        const {aid, name, desc, tags} = item.item;
        return renderResultItem(aid, name, tags, desc);
    }).join('\n')
}

const runSearch = () => {
    if (!allowSearch) 
        $result.html('<p>本地搜索初始化尚未完成！</p>')
    const keyword = $input.val();
    if (keyword.length < 3)
        $result.html('<p>待搜索关键字过短！</p>')
    else {
        const res = $fuse.search(keyword);
        if (res.length > 0) $message.html(`<p>共搜索到 ${res.length} 条结果</p>`)
        else $message.html('');
        $result.html(renderRawSearchResult(res));
    }
}

$button.click(function (e) {
    runSearch();
})

$input.keydown(function(event) {  
    if (event.keyCode == 13) runSearch();
})






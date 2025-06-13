import React from 'react'

import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import addClasses from 'rehype-add-classes';

function MarkdownPreview({ markdown }) {

    return <Markdown

        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, [addClasses, {
            table: 'table table-sm table-striped table-borderless table-responsive',
            blockquote: 'blockquote',
            'blockquote > p': 'text-primary',
            ul: 'list-group list-group-flush',
            li: 'list-group-item',
            img: 'rounded mx-auto d-block',
            //  span: "katex"
        }]]}

        components={{
            h2(props) {
                const { node, ...rest } = props
                return <div class="p-3 mb-2 bg-primary text-white" {...rest} />
            },
            h3(props) {
                const { node, ...rest } = props
                return <div class="p-3 mb-2 bg-success text-white" {...rest} />
            }
        }}
    >
        {markdown}
    </Markdown>
}

export default MarkdownPreview
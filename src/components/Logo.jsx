export function Logo(props) {
  return (
    <svg viewBox="0 0 107 24" aria-hidden="true" {...props}>
      <path
        className="fill-emerald-400"
        d="M7.403 4.338a7.403 7.403 0 1 0 0 14.805 7.403 7.403 0 0 0 0-14.805Zm.13 10.13a2.597 2.597 0 1 0 0-5.195 2.597 2.597 0 0 0 0 5.194Z"
      />
      <path
        className="fill-violet-400"
        d="M5.916 12.866a1 1 0 0 1 0-1.732l12-6.928a1 1 0 0 1 1.5.866v13.856a1 1 0 0 1-1.5.866l-12-6.928Z"
      />
      <path
        className="fill-zinc-900 dark:fill-white"
        d="M26.797 5.636h4.177l2.874 7.003h.145l2.873-7.003h4.178V18H37.76v-7.148h-.097l-2.752 7.051h-1.98l-2.753-7.099h-.097V18h-3.284V5.636ZM47.15 18.17c-1.006 0-1.867-.2-2.583-.598a4.11 4.11 0 0 1-1.648-1.678c-.383-.72-.574-1.555-.574-2.505s.191-1.783.574-2.5c.382-.72.931-1.28 1.648-1.678.716-.402 1.577-.603 2.583-.603 1.007 0 1.868.2 2.584.603a4.063 4.063 0 0 1 1.648 1.678c.383.717.574 1.55.574 2.5s-.191 1.785-.574 2.505a4.11 4.11 0 0 1-1.648 1.678c-.716.399-1.578.598-2.584.598Zm.025-2.463c.281 0 .525-.095.73-.284.205-.189.364-.459.477-.809.113-.35.169-.766.169-1.25 0-.486-.056-.903-.17-1.249-.112-.35-.27-.62-.476-.809a1.042 1.042 0 0 0-.73-.284c-.298 0-.554.095-.767.284-.214.19-.377.459-.49.809-.112.346-.168.763-.168 1.25 0 .483.056.9.169 1.25.113.35.276.62.489.808.213.19.469.284.767.284ZM62.37 8.727 59.256 18h-3.864l-3.115-9.273h3.502l1.497 6.134h.096l1.498-6.134h3.501ZM63.319 18V8.727h3.332V18H63.32Zm1.666-10.239c-.45 0-.837-.149-1.16-.446a1.412 1.412 0 0 1-.482-1.075c0-.418.16-.777.483-1.075a1.647 1.647 0 0 1 1.159-.446c.455 0 .841.149 1.16.446.321.298.482.657.482 1.075 0 .419-.16.777-.483 1.075a1.634 1.634 0 0 1-1.159.446Zm7.807 10.408c-.99 0-1.843-.19-2.56-.567a3.977 3.977 0 0 1-1.647-1.643c-.383-.716-.574-1.573-.574-2.571 0-.958.193-1.795.58-2.512a4.141 4.141 0 0 1 1.636-1.672c.704-.398 1.535-.597 2.493-.597.7 0 1.334.108 1.901.326a3.983 3.983 0 0 1 1.455.947c.403.41.713.91.93 1.497.217.588.326 1.25.326 1.987v.772h-8.283v-1.835h5.216a1.279 1.279 0 0 0-.205-.7 1.307 1.307 0 0 0-.525-.477 1.544 1.544 0 0 0-.743-.175c-.27 0-.517.058-.742.175-.226.113-.407.27-.544.47a1.327 1.327 0 0 0-.21.707v1.98c0 .298.061.564.186.797.125.234.304.417.537.55.234.132.516.199.846.199.23 0 .438-.033.628-.097.193-.064.358-.157.495-.278a1.13 1.13 0 0 0 .301-.446h3.043a3.465 3.465 0 0 1-.742 1.678c-.39.47-.908.837-1.552 1.099-.64.257-1.388.386-2.246.386Zm9.232-12.533V18h-3.332V5.636h3.332ZM83.722 18V8.727h3.333V18h-3.333Zm1.666-10.239c-.45 0-.837-.149-1.159-.446a1.412 1.412 0 0 1-.483-1.075c0-.418.161-.777.483-1.075a1.647 1.647 0 0 1 1.16-.446c.454 0 .84.149 1.158.446.322.298.483.657.483 1.075 0 .419-.16.777-.483 1.075a1.633 1.633 0 0 1-1.159.446Zm11.84 3.985h-3.066a.844.844 0 0 0-.2-.49 1.119 1.119 0 0 0-.453-.313 1.538 1.538 0 0 0-.603-.115c-.286 0-.531.052-.737.157-.205.105-.306.254-.301.447a.5.5 0 0 0 .175.38c.124.117.364.207.718.272l1.883.338c.95.173 1.657.465 2.12.875.466.407.702.952.706 1.636-.004.66-.201 1.234-.592 1.72-.386.484-.915.858-1.588 1.124-.668.261-1.43.392-2.288.392-1.416 0-2.525-.29-3.326-.87-.797-.579-1.242-1.343-1.334-2.293h3.308a.95.95 0 0 0 .435.682c.25.157.563.235.942.235.305 0 .557-.052.754-.157.201-.104.304-.253.308-.446-.004-.178-.093-.318-.266-.423-.169-.105-.434-.19-.796-.254l-1.642-.29c-.946-.164-1.655-.478-2.126-.941-.47-.463-.704-1.059-.7-1.787-.004-.644.165-1.19.507-1.636.346-.45.84-.793 1.48-1.026.643-.238 1.406-.356 2.287-.356 1.34 0 2.397.277 3.17.833.776.555 1.185 1.324 1.225 2.306Zm7.048-3.019v2.415h-6.109V8.727h6.109ZM99.35 6.506h3.333v8.512c0 .128.022.237.066.326a.436.436 0 0 0 .205.193c.093.04.212.06.356.06a2 2 0 0 0 .351-.036c.136-.024.237-.044.301-.06l.483 2.342c-.149.044-.362.099-.64.163a5.611 5.611 0 0 1-.977.127c-.765.04-1.407-.038-1.926-.236-.519-.2-.91-.517-1.171-.947-.262-.431-.389-.97-.38-1.618V6.506Z"
      />
    </svg>
  )
}

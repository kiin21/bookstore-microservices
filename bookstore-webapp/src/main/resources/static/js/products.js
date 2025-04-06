document.addEventListener('alpine:init', () => {
    Alpine.data('initData', (pageNo) => ({
        pageNo: pageNo,
        products: {
            data: [],
        },
        init() {
            this.loadProducts(this.pageNo);
        },
        loadProducts(pageNo) {
                $.getJSON("http://localhost:8989/catalog/api/products?page=" + pageNo, (res) => {
                this.products = res;
            })
        }
    }))
})
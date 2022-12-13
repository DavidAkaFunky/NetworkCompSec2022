class ProductService {

    private static products = [
        {
            ownerId: "1",
            name: "Product 1",
        },
        {
            ownerId: "2",
            name: "Product 2",
        }
    ]

    public static getUserProducts = async (id: string): Promise<{ ownerId: string; name: string; }[]> => {
        return this.products.filter(product => product.ownerId === id);
    };
}

export default ProductService;
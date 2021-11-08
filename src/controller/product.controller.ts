import { Request, Response } from "express";
import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from "../service/product.service";


export async function createProductHandler(req: Request<{}, {}, CreateProductInput["body"]>, res: Response) {
    const userId = res.locals.user._id

    const body = req.body

    const product = await createProduct({ ...body, user: userId })

    return res.status(200).json({msg: "success", product})
}

export async function getProductHandler(req: Request<UpdateProductInput["params"]>, res: Response) {
    const userId = res.locals.user._id

    const productId = req.params.productId
    const update = req.body

    const product = await findProduct({productId})

    if (!product) {
        return res.status(404).json({msg: `no product with the id ${productId}`})
    }

    return res.status(200).json({msg: "success", product})
}

export async function updateProductHandler(req: Request, res: Response) {
    const userId = res.locals.user._id

    const productId = req.params.productId
    const update = req.body

    const product = await findProduct({productId})

    if (!product) {
        return res.status(404).json({msg: `no product with the id ${productId}`})
    }

    if (String(product.user) !== userId) {
        return res.status(403).json({msg: "forbidden"})
    }

    const updatedProduct = await findAndUpdateProduct({productId}, update, {new: true})

    return res.status(200).json({msg: "success", updatedProduct})
}

export async function deleteProductHandler(req: Request, res: Response) {
    const userId = res.locals.user._id

    const productId = req.params.productId

    const product = await findProduct({productId})

    if (!product) {
        return res.status(404).json({msg: `no product with the id ${productId}`})
    }

    if (String(product.user) !== userId) {
        return res.status(403).json({msg: "forbidden"})
    }

    await deleteProduct({productId})

    return res.status(200).json({msg: "success"})
}
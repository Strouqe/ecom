import Head from "next/head"
import { useRouter } from "next/router";
import { useSelector } from "react-redux"
import Button from "../components/Button";
import { selectBasketItems } from "../redux/basketSlice"
import { useEffect, useState } from "react";
import CheckoutProduct from "../components/CheckoutProduct";

function Checkout() {
    const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
        {} as { [key: string]: Product[] }
    )

    const items = useSelector(selectBasketItems);
    const router = useRouter();

    useEffect(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item._id] = results[item._id] || []).push(item)
            return results
        }, {} as { [key: string]: Product[] })

        setGroupedItemsInBasket(groupedItems)

    },[items])

  return (
    <div>
        <Head>
            <title>Bag - Apple</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            <div>
                <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
                    {items.length > 0 ? "Review your items." : "Your bag is empty."}
                </h1>
                <p className="my-4">Free delivery and free returns.</p>
                {items.length > 0 && (
                    <Button
                    title="Continue Shopping"
                    onClick={() => router.push("/")}
                    />
                )}
            </div>

            {items.length > 0 && (
                <div>
                    {Object.entries(groupedItemsInBasket).map(([key, value]) => (
                        <CheckoutProduct key={key} items={items} id={key}/>
                    ))}
                </div>
            )}
        </main>
    </div>
  )
}

export default Checkout
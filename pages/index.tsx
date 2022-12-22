import type { GetServerSideProps } from "next"
import Head from 'next/head'
import Header from '../components/Header'
import Landing from '../components/Landing'
import { Tab } from '@headlessui/react'
import { fetchCategories } from '../utils/fetchCategories'
import { fetchProducts } from "../utils/fetchProducts"
import useSWR from 'swr'
import Product from "../components/Product"
import Basket from "../components/Basket"

interface Props {
  categories: Category[],
  
}

const Home = () => {
  // const categories = fetchCategories()
  // const products = fetchProducts()
  const fetcher = (url:string) => fetch(url).then(data => data.json())

  const fetchCategories = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`, fetcher)
  console.log("Home Categories" ,fetchCategories.data?.categories)
  let categories : Category [] = fetchCategories.data?.categories

  const fetchProducts = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getProducts`, fetcher)

  let products : Product [] = fetchProducts.data?.products
  console.log("Home Products1" , fetchProducts.data?.products)
  const showProducts = (category: number) => {
    return products?.filter((product) => product.category._ref === categories[category]._id).map((product) => (
      <Product product={product} key={product._id}/>
    ))
  }
  return (
    <div>
      <Head>
        <title>Electronics Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Basket />
      <main className='relative h-[200vh] bg-[#E7ECEE]'>
        <Landing />
      </main>
      <section className='relative z-40 -mt-[100vh] min-h-screen bg-[#1B1B1B]'>
        <div className='space-y-10 py-16'>
          <h1 className='text-center text-4xl font-medium tracking-wide text-white md:text-5xl'>
            New Promos
          </h1>
          <Tab.Group>
            <Tab.List className="flex justify-center">
              {categories && categories.map((category) => (
                <Tab
                  key={category._id}
                  id={category._id}
                  className={({ selected }) =>
                    `whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
                      selected
                        ? "borderGradient bg-[#35383C] text-white"
                        : "border-b-2 border-[#35383C] text-[#747474]"
                    }`
                  }
                >
                  {category.title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
              <Tab.Panel className="tabPanel">{showProducts(0)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(3)}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </div>
  )
}

export default Home

export const getServersideProps = async () => {
  // const categories = await fetchCategories()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`)

  const data = await res.json()
  const categories: Category[] = data.categories
  const products = await fetchProducts()
  console.log("getServersideprops" ,categories);

  return {
    props: {
      categories,
      products
    },
  }
}
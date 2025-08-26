'use client'
import { getTopProducts } from '@/components/Tables/fetch';
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useEffect, useState } from 'react'

const Today = () => {

    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getTopProducts();
            setData(res);
        };
        fetchData();
    }, [page]);

    return (
        <div>

            <div className='mb-4 flex flex-col md:flex-row gap-4 items-center'>
                <h3 className='text-xl text-dark-2 dark:text-dark-8'>จ่ายวันนี้</h3>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                        <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                            Product Name
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sold</TableHead>
                        <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                            Profit
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product) => (
                        <TableRow
                            className="text-base font-medium text-dark dark:text-white"
                            key={product.name + product.profit}
                        >
                            <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                <div>{product.name}</div>
                            </TableCell>

                            <TableCell>{product.category}</TableCell>

                            <TableCell>${product.price}</TableCell>

                            <TableCell>{product.sold}</TableCell>

                            <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                                ${product.profit}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                currentPage={page}
                totalPages={10}
                onPageChange={(p) => setPage(p)}
                className="mt-4 flex justify-end"
            />
        </div>
    )
}

export default Today
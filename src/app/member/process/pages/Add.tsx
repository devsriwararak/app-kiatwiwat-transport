'use client'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formathDateThai, formatNumber } from '@/lib/utils';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { dataType } from '../page';
import { PencilSquareIcon } from '@/assets/icons';

interface propsType {
    dataProps: dataType[];
    totalPageProp: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setDataSend: Dispatch<SetStateAction<dataType>>
    index : number | null
    setIndex : Dispatch<SetStateAction<number | null>>
}

const Add = ({ dataProps, totalPageProp, currentPage, setCurrentPage, index, setIndex, setDataSend }: propsType) => {

    const [data, setData] = useState<dataType[]>(dataProps);

    const handleClick = (product: dataType) => {
        setIndex(product.id)
        setDataSend({
            id: product.id,
            bill_number: product.bill_number,
            payment_date: product.payment_date,
            payment_day : product.payment_day,
            payment_amount: product.payment_amount,
            status: product.status,
            member_id: product.member_id,
            member_name: product.member_name,
            days_left: product.days_left,
            user_name: product.user_name , 
            created_at : product.created_at
        })
    }

    useEffect(() => {
        setData(dataProps)
    }, [currentPage, dataProps]);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                        <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                            เลขที่บิล
                        </TableHead>
                        <TableHead>ชื่อลูกค้า</TableHead>
                        <TableHead>จำนวนเงิน</TableHead>
                        <TableHead>กำหนดชำระ</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((product: dataType) => (
                        <TableRow
                            className={`text-sm font-medium text-dark dark:text-white ${index === product.id ? "bg-dark-8 dark:bg-dark-4" : ""} `}
                            key={product.id}
                        >
                            <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                <div>{product.bill_number}</div>
                            </TableCell>

                            <TableCell>{product.member_name}</TableCell>

                            <TableCell>{formatNumber(product.payment_amount)}</TableCell>

                            <TableCell>{formathDateThai(product.payment_date)}</TableCell>
                            <TableCell onClick={() => handleClick(product)} className='flex justify-center cursor-pointer  '><PencilSquareIcon /></TableCell>


                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPageProp}
                onPageChange={(p) => setCurrentPage(p)}
                className="mt-4 flex justify-end"
            />
        </div>
    )
}

export default Add
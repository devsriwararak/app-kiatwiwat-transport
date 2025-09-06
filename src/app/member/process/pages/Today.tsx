'use client'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { dataType } from '../page';
import moment from 'moment';
import { formathDateThai, formatNumber } from '@/lib/utils';
import { DotIcon, PencilSquareIcon } from '@/assets/icons';
import { BellIcon } from '@/components/Layouts/header/notification/icons';
import { HomeIcon } from '@/components/Layouts/sidebar/icons';

interface propsType {
    due_today: dataType[];
    overdue: dataType[];
setDataSend: Dispatch<SetStateAction<dataType>>
    totalPageProp: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    index: number | null
    setIndex: Dispatch<SetStateAction<number | null>>
}

const Today = ({ due_today, overdue, totalPageProp, currentPage, setCurrentPage, index, setIndex, setDataSend }: propsType) => {

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
            user_name: product.user_name,
            created_at: product.created_at
        })
    }
    return (
        <div className='mt-4'>
            <div className='my-4 mt-0 text-base bg-dark-8/70 dark:bg-dark-2 w-full text-center rounded-sm text-dark-2 dark:text-dark-8'>ค้างจ่าย ติดลบ</div>

            <div className='  h-60 overflow-y-auto'>
                <Table className=' '>
                    <TableHeader className=' '>
                        <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                            <TableHead>จำนวนวัน</TableHead>

                            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                                เลขที่บิล
                            </TableHead>
                            <TableHead>ลูกค้า</TableHead>
                            <TableHead>ราคา</TableHead>
                            <TableHead>กำหนดชำระ</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='overflow-y-scroll '>

                        {overdue?.map((product) => (
                            <TableRow
                                className={`text-sm font-medium cursor-pointer text-dark dark:text-white ${index === product.id ? "bg-dark-8/50 dark:bg-dark-4" : ""} `}
                                key={product.id}
                                onClick={() => handleClick(product)}
                            >
                                <TableCell> 
                                    <div className='flex gap-3'>
                                        <BellIcon className={`${product.days_left >= -10 && product.days_left <= -1 ? "bg-yellow-500" :"bg-red-500" } rounded-full p-0.5`} /> {product.days_left}
                                    </div>
                                </TableCell>
                                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                    <div>{product.bill_number}</div>
                                </TableCell>
                                <TableCell>{product.member_name}</TableCell>
                                <TableCell >{formatNumber(product.payment_amount)}</TableCell>
                                <TableCell>{formathDateThai(product.payment_date)}</TableCell>
                                <TableCell onClick={() => handleClick(product)} className='flex justify-end cursor-pointer   '><PencilSquareIcon className='active:bg-gray-300' /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='my-4 mt-8 text-base bg-dark-8/70 dark:bg-dark-2 w-full text-center rounded-sm text-dark-2 dark:text-dark-8'>รายชื่อค้างจ่ายวันนี้</div>


            <div className='h-60 overflow-y-auto'>
                <Table>
                    <TableBody>
                        {due_today?.map((product) => (
                            <TableRow
                                className="text-sm font-medium text-dark dark:text-white cursor-pointer"
                                key={product.id}
                                onClick={() => handleClick(product)}
                            >
                                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                    <div>{product.bill_number}</div>
                                </TableCell>
                                <TableCell>{product.member_name}</TableCell>
                                <TableCell>{formatNumber(product.payment_amount)}</TableCell>
                                <TableCell>{formathDateThai(product.payment_date)}</TableCell>
                                <TableCell onClick={() => handleClick(product)} className='flex justify-end cursor-pointer hover:bg-gray-200  p-2 rounded-full '><PencilSquareIcon /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPageProp}
                onPageChange={(p) => setCurrentPage(p)}
                className="mt-4 flex justify-end"
            /> */}
        </div>
    )
}

export default Today


'use client'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { dataType } from '../page';
import moment from 'moment';
import { formathDateThai } from '@/lib/utils';
import { PencilSquareIcon } from '@/assets/icons';

interface propsType {
    due_today: dataType[];
    overdue: dataType[];

    totalPageProp: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Today = ({ due_today, overdue, totalPageProp, currentPage, setCurrentPage }: propsType) => {
    const [index, setIndex] = useState<number | null>(null)

    const handleClick = (id: number) => {
        setIndex(id)
    }

    return (
        <div>
            <div className='my-4 mt-0 text-base bg-gray-200 w-full text-center rounded-sm text-dark-2'>ค้างจ่าย ติดลบ</div>

            <div className='  h-60 overflow-y-auto'>
                <Table className=' '>
                    <TableHeader className=' '>
                        <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                            <TableHead>จำนวนวัน</TableHead>

                            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                                เลขที่บิล
                            </TableHead>
                            <TableHead>ชื่อลูกค้า</TableHead>
                            <TableHead>จำนวนเงิน</TableHead>
                            <TableHead>กำหนดชำระ</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='overflow-y-scroll '>

                        {overdue?.map((product) => (
                            <TableRow
                                className={`text-sm font-medium text-dark dark:text-white ${index === product.id ? "bg-gray-200" : ""} `}
                                key={product.id}
                            >
                                <TableCell>{product.days_left}</TableCell>
                                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                    <div>{product.bill_number}</div>
                                </TableCell>
                                <TableCell>{product.member_name}</TableCell>
                                <TableCell>${product.payment_amount}</TableCell>
                                <TableCell>{formathDateThai(product.payment_date)}</TableCell>
                                <TableCell onClick={() => handleClick(product.id)} className='flex justify-end cursor-pointer   '><PencilSquareIcon className='active:bg-gray-300' /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='my-4  text-base bg-gray-200 w-full text-center rounded-sm text-dark-2'>รายชื่อค้างจ่ายวันนี้</div>


            <div className=''>
                <Table>
                    <TableBody>
                        {due_today?.map((product) => (
                            <TableRow
                                className="text-sm font-medium text-dark dark:text-white"
                                key={product.id}
                            >
                                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                    <div>{product.bill_number}</div>
                                </TableCell>
                                <TableCell>{product.member_name}</TableCell>
                                <TableCell>${product.payment_amount}</TableCell>
                                <TableCell>{formathDateThai(product.payment_date)}</TableCell>
                                <TableCell onClick={() => handleClick(product.id)} className='flex justify-end cursor-pointer hover:bg-gray-200  p-2 rounded-full '><PencilSquareIcon /></TableCell>
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


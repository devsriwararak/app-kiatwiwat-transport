'use client'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formathDateThai } from '@/lib/utils';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { dataType } from '../page';
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne';
import moment from 'moment';
import { Button } from '@/components/ui-elements/button';
import { PencilSquareIcon } from '@/assets/icons';

interface propsType {
    dataProps: dataType[];
    startDate: string; // เปลี่ยนจาก Date | null เป็น string
    setStartDate: Dispatch<SetStateAction<string>>;
    endDate: string;   // เปลี่ยนจาก Date | null เป็น string
    setEndDate: Dispatch<SetStateAction<string>>;
    totalPageProp: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setDataSend : Dispatch<SetStateAction<dataType>>
}

const Add = ({ dataProps, totalPageProp, currentPage, setCurrentPage, setStartDate, setEndDate, startDate, endDate, setDataSend }: propsType) => {

    const [data, setData] = useState<dataType[]>(dataProps);
    const [index, setIndex] = useState<number | null>(null)

    const handleCancel = () => {
        const formattedDate = moment(Date.now()).format("YYYY-MM-DD"); // "2025-08-29"
        setStartDate("")
        setEndDate("")
    }

    const handleClick = (product:dataType)=>{
        setIndex(product.id)
        setDataSend({
            id: product.id,
            bill_number: product.bill_number,
            payment_date: product.payment_date,
            payment_amount: product.payment_amount,
            status: product.status,
            member_id: product.member_id,
            member_name: product.member_name,
            days_left: product.days_left
        })
    }

    useEffect(() => {
        setData(dataProps)
    }, [currentPage, dataProps]);

    return (
        <div>

            <div className='mb-4 flex flex-col md:flex-row gap-4 items-end'>
                <DatePickerOne
                    label="วันที่เริ่มต้น"
                    name="start_date"
                    onChange={(date) => setStartDate(date ? moment(date).format("YYYY-MM-DD") : "")}
                    value={startDate}
                />
                <DatePickerOne
                    label="วันที่สิ้นสุด"
                    name="end_date"
                    onChange={(date) => setEndDate(date ? moment(date).format("YYYY-MM-DD") : "")}
                    value={endDate}
                />
                <Button onClick={handleCancel} label='เคลีย' className='h-9' shape="rounded" variant="primary" />
            </div>

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
                            className={`text-sm font-medium text-dark dark:text-white ${index === product.id ? "bg-gray-200" : ""} `}
                            key={product.id}
                        >
                            <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                                <div>{product.bill_number}</div>
                            </TableCell>

                            <TableCell>{product.member_name}</TableCell>

                            <TableCell>${product.payment_amount}</TableCell>

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
'use client'

import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import React, { useEffect, useState } from 'react'
import Today from './pages/Today'
import Add from './pages/Add'
import Success from './pages/Success'
import InputGroup from '@/components/FormElements/InputGroup'
import { CallIcon, CheckIcon, UploadIcon, UserIcon } from '@/assets/icons'
import DatePickerTwo from '@/components/FormElements/DatePicker/DatePickerTwo'
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import { BellIcon } from '@/components/Layouts/header/notification/icons'
import { api, handleAxiosError } from '@/utils/api'
import { toast } from 'react-toastify'
import { SingleValue } from "react-select";
import dynamic from 'next/dynamic'
import moment from 'moment'
import { useSession } from 'next-auth/react'


const Select = dynamic(() => import("react-select"), { ssr: false });

export interface dataType {
    id: number
    bill_number: string
    payment_date: string
    payment_amount: number,
    status: number,
    member_id: number,
    member_name: string
    days_left: number
}

type OptionType = {
    value: string;
    label: string;
};

const PageProcess = () => {
    const [data, setData] = useState<dataType[]>([]);
    const [due_today, setDue_today] = useState<dataType[]>([])
    const [overdue, setOverdue] = useState<dataType[]>([])
    const [id, setId] = useState<number | null>(null)

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const dateNow = moment(Date.now()).format("YYYY-MM-D")


    // Header 
    const [total_outstanding, setTotal_outstanding] = useState(0)
    const [unpaid_bill_count, setUnpaid_bill_count] = useState(0)

    const [dataSend, setDataSend] = useState<dataType>({
        id: 0,
        bill_number: "",
        payment_date: dateNow,
        payment_amount: 0,
        status: 1,
        member_id: 0,
        member_name: "",
        days_left: 0
    })

    const [options, setOptions] = useState<OptionType[]>([]);
    const [selected, setSelected] = useState<SingleValue<OptionType>>(null);

    // date
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const { data: session, status } = useSession()


    const fetchData = async () => {
        try {
            let endPoint: string | null = null;
            // let params: Record<string, any> = { page: currentPage, limit: 6 };
            let params: Record<string, any> = {};

            if (page === 1) {
                endPoint = `/bill/${process.env.NEXT_PUBLIC_V}/all/overdue`
                params.sort = "ASC"

            } else if (page === 2) {
                endPoint = `/bill/${process.env.NEXT_PUBLIC_V}/all`
                params.date_from = startDate;
                params.date_to = endDate;
                params.page = currentPage
                params.limit = 100
            } else {

            }
            console.log({ endPoint });

            if (!endPoint) {
                console.warn("No endpoint defined for page", page);
                return;
            }

            const res = await api.get(endPoint, { params })
            console.log(res.data);
            if (res.status === 200) {
                setData(res.data.results)
                setTotalPage(res.data.pagination.total_pages)
                setTotal_outstanding(res.data.header.total_outstanding)
                setUnpaid_bill_count(res.data.header.unpaid_bill_count)
                if (res?.data?.results?.due_today) {
                    console.log('111');

                    setDue_today(res.data.results.due_today)
                }
                if (res?.data?.results?.overdue) {
                    console.log('222');
                    setOverdue(res.data.results.overdue)
                }
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    const fetchOptions = async () => {
        try {
            const res = await api.get(`/members/${process.env.NEXT_PUBLIC_V}/all`)
            const data = res.data.results.map((user: any) => ({
                value: user.id.toString(),
                label: user.full_name,
            }));
            setOptions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const clearStateSave = () => {
        setDataSend({
            id: 0,
            bill_number: "",
            payment_date: "",
            payment_amount: 0,
            status: 1,
            member_id: 0,
            member_name: "",
            days_left: 0
        })
        setOptions([])
        setSelected(null)
    }


    const handleSave = async () => {
        try {
            console.log("dataSend before save:", dataSend);

            if (!dataSend.id) {
                const payload = {
                    // payment_date: dataSend.payment_date,
                    payment_date: dataSend.payment_date || dateNow,
                    payment_amount: dataSend.payment_amount,
                    status: dataSend.status,
                    member_id: Number(selected?.value),
                }
                console.log(payload);
                const res = await api.post(`/bill/${process.env.NEXT_PUBLIC_V}/create`, payload)
                if (res.status === 201) {
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                    clearStateSave()
                }

            } else {

                const payload = {
                    payment_date: dataSend.payment_date,
                    payment_amount: Number(dataSend.payment_amount),
                    member_id: Number(selected?.value)

                }
                console.log(payload);

                const res = await api.put(`/bill/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`, payload)
                if (res.status === 200) {
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                }

            }


        } catch (error) {
            handleAxiosError(error)
        }
    }

    const handleChangeOption = (option: SingleValue<OptionType>) => {
        setSelected(option);
    };



    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataSend((prev) => (
            { ...prev, [name]: value }
        ))

    }

    const handleChangeDate = (date: string | Date | null) => {
        if (!date) return;
        const formattedDate = moment(date).format("YYYY-MM-DD"); // "2025-08-29"
        console.log({ formattedDate });

        setDataSend((prev) => ({
            ...prev,
            payment_date: formattedDate ? formattedDate : "",
        }));
    };

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/bill/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`)
            if (res.status === 204) {
                toast.success('ลบสำเร็จ')
                await fetchData()
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    const handlePay = async () => {
        try {
            if (status == "authenticated") {

                const user_id = session.user.id
                const res = await api.put(`/bill/${process.env.NEXT_PUBLIC_V}/${dataSend.id}/pay`, { user_id: user_id })
                
                if (res.status === 200) {
                    toast.success('ลบสำเร็จ')
                    await fetchData()
                }
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchOptions()
    }, [page, currentPage, startDate, endDate, data?.length, overdue.length])
    return (
        <div>
            page : {page}
            <div className='flex gap-4'>
                <Button label='ต้องจ่ายวันนี้' className='h-10' shape="rounded" variant={`${page === 1 ? "red" : "outlineRed"}`} onClick={() => setPage(1)} />
                <Button label='เพิ่มใหม่' className='h-10' shape="rounded" variant={`${page === 2 ? "primary" : "outlinePrimary"}`} onClick={() => setPage(2)} />
                <Button label='จ่ายแล้ว' className='h-10' shape="rounded" variant={`${page === 3 ? "green" : "outlineGreen"}`} onClick={() => setPage(3)} />
            </div>

            <div className='flex flex-col md:flex-row gap-4 mt-6'>
                <Card className='w-full md:w-7/12'>

                    {Array.isArray(due_today) && page === 1 ?
                        <Today
                            due_today={due_today ? due_today : []}
                            overdue={overdue ? overdue : []}
                            totalPageProp={totalPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        /> :
                        Array.isArray(data) && page === 2 ?
                            <Add
                                dataProps={Array.isArray(data) ? data : []}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                totalPageProp={totalPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setDataSend={setDataSend}
                            /> :
                            Array.isArray(data) && page === 3 ?
                                <Success /> : ""}

                </Card>
                <div className='w-full md:w-5/12'>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Card className='w-full'>
                            <span>จำนวน</span>
                            <div className='flex gap-2 justify-end items-center  '>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>{unpaid_bill_count || 0}</h2>
                                <span>คน</span>
                            </div>
                        </Card>
                        <Card className='w-full'>
                            <span>ราคา</span>
                            <div className='flex gap-2 justify-end items-center'>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>{total_outstanding || 0}</h2>
                                <span>บาท</span>
                            </div>
                        </Card>
                    </div>
                    <Card className='mt-4'>
                        <div className='flex justify-between'>
                            <h3 className='text-dark-2 dark:text-dark-8 text-xl'>เพิ่ม/แก้ไข</h3>
                            <p>สถานะ : ชำระเงินแล้ว</p>
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row mt-4">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="เลขที่บิล"
                                placeholder="A-08-68-0001"
                                icon={<UserIcon />}
                                iconPosition="left"
                                disabled
                                height="sm"
                                value={dataSend?.bill_number ?? ""}
                            />

                            <div className="w-full sm:w-1/2">
                                <label htmlFor="" className='text-sm text-dark-3 '>ค้นหาลูกค้า</label>
                                <Select
                                    options={options}
                                    value={selected}
                                    onChange={(newValue) => {
                                        // newValue type: unknown
                                        setSelected(newValue as OptionType | null);
                                    }}
                                    isClearable
                                />
                            </div>
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row ">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="สร้างวันที่"
                                placeholder="12-08-2568"
                                icon={<UploadIcon />}
                                iconPosition="left"
                                disabled
                                height="sm"
                            />
                            <DatePickerOne label="ชำระวันที่" name="payment_date" onChange={handleChangeDate} />
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row ">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="payment_amount"
                                label="จำนวนเงิน"
                                placeholder="500.00"
                                icon={<CheckIcon />}
                                iconPosition="left"
                                height="sm"
                                value={String(dataSend?.payment_amount) ?? ""}
                                onChange={handleChangeInput}
                            />

                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="พนักงานที่กดบันทึก"
                                placeholder=""
                                icon={<BellIcon />}
                                iconPosition="left"
                                disabled
                                height="sm"
                            />
                        </div>

                        <hr className='my-6' />

                        <div className='flex justify-end gap-4'>
                            {dataSend.id && (
                                <Button onClick={handlePay} label={`ชำระเงิน`} className='h-9' shape="rounded" variant="red" />
                            )}
                            <Button onClick={handleDelete} label={`ลบ`} className='h-9' shape="rounded" variant="red" />
                            <Button onClick={handleSave} label={`${!dataSend.id ? "บันทึก" : "แก้ไข"}`} className='h-9' shape="rounded" variant="primary" />
                        </div>

                    </Card>



                </div>
            </div>
        </div>
    )
}

export default PageProcess
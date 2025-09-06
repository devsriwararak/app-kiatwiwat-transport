'use client'

import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import React, { useEffect, useState } from 'react'
import Today from './pages/Today'
import Add from './pages/Add'
import Success from './pages/Success'
import InputGroup from '@/components/FormElements/InputGroup'
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import { api, handleAxiosError } from '@/utils/api'
import { toast } from 'react-toastify'
import { SingleValue } from "react-select";
import dynamic from 'next/dynamic'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { AlertConfirm, formathDateThai, formatNumber } from '@/lib/utils'
import { Select } from '@/components/FormElements/select'


const SelectReact = dynamic(() => import("react-select"), { ssr: false });

export interface dataType {
    id: number
    bill_number: string
    payment_date: string
    payment_day: string
    payment_amount: number,
    status: number,
    member_id: number | null,
    member_name: string
    days_left: number
    user_name: string
    created_at: string
}

type OptionType = {
    value: string;
    label: string;
};

const PageProcess = () => {
    const [data, setData] = useState<dataType[]>([]);
    const [due_today, setDue_today] = useState<dataType[]>([])
    const [overdue, setOverdue] = useState<dataType[]>([])
    const [index, setIndex] = useState<number | null>(null)


    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const dateNow = moment(Date.now()).format("YYYY-MM-D")


    // Header 
    const [total_outstanding, setTotal_outstanding] = useState(0)
    const [unpaid_bill_count, setUnpaid_bill_count] = useState(0)

    // Search
    const [searchMember, setSearchMember] = useState("")
    const [searchBillNumber, setSearchBillNumber] = useState("")

    const [dataSend, setDataSend] = useState<dataType>({
        id: 0,
        bill_number: "",
        payment_date: dateNow,
        payment_day: dateNow,
        payment_amount: 0,
        status: 1,
        member_id: null,
        member_name: "",
        days_left: 0,
        user_name: "",
        created_at: ""
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
            let params: Record<string, any> = { search_bill: searchBillNumber };

            if (page === 1) {
                endPoint = `/bill/${process.env.NEXT_PUBLIC_V}/all/overdue`
                params.sort = "ASC"


            } else if (page === 2) {
                endPoint = `/bill/${process.env.NEXT_PUBLIC_V}/all`
                params.search_member = searchMember
                params.page = currentPage
                params.limit = 6
            } else {
                endPoint = `/bill/${process.env.NEXT_PUBLIC_V}/all/pay`
                // params.date_from = startDate;
                // params.date_to = endDate;
                params.date_from = startDate;
                params.date_to = endDate;
                params.page = currentPage
                params.limit = 6

            }
            console.log({ endPoint });
            console.log({ params });


            if (!endPoint) {
                console.warn("No endpoint defined for page", page);
                return;
            }

            const res = await api.get(endPoint, { params })
            console.log(res.data);
            if (res.status === 200) {
                setData(res.data.results)
                setTotalPage(res.data.pagination.total_pages)
                let sum = 0
                if (status === "authenticated") {
                    if (session.user.role_id === 1) sum = res.data.header.total_outstanding
                }
                setTotal_outstanding(sum)
                setUnpaid_bill_count(res.data.header.unpaid_bill_count)
                if (res?.data?.results?.due_today) {
                    setDue_today(res.data.results.due_today)
                }
                if (res?.data?.results?.overdue) {
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
            handleAxiosError(err)
        }
    };

    const clearStateSave = () => {
        setDataSend({
            id: 0,
            bill_number: "",
            payment_date: "",
            payment_day: "",
            payment_amount: 0,
            status: 1,
            member_id: null,
            member_name: "",
            days_left: 0,
            user_name: "",
            created_at: "",
        })
        // setOptions([])
        setSelected(null)
        setStartDate("")
        setEndDate("")
        setIndex(null)
        setSearchBillNumber("")
    }


    const handleSave = async (statusPay?: number | null) => {
        try {

            if (!dataSend.id) {
                const payload = {
                    bill_number: `BI${dataSend.bill_number}`,
                    payment_date: dataSend.payment_date || dateNow,
                    payment_amount: dataSend.payment_amount,
                    status: dataSend.status,
                    member_id: Number(selected?.value),
                }
                console.log({ payload1: payload });
                const res = await api.post(`/bill/${process.env.NEXT_PUBLIC_V}/create`, payload)
                if (res.status === 201) {
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                    await fetchOptions()
                    clearStateSave()
                }

            } else {
                const payload = {
                    payment_day: dataSend.payment_day,
                    payment_date: dataSend.payment_date,
                    payment_amount: Number(dataSend.payment_amount),
                    member_id: Number(selected?.value),
                    status: statusPay ? statusPay : dataSend.status
                }
                console.log({ payload2: payload });

                const res = await api.put(`/bill/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`, payload)

                if (res.status === 200) {
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                    await fetchOptions()
                    clearStateSave()
                }
            }

        } catch (error) {
            toast.error('เกิดข้อผิดพลาด')
            handleAxiosError(error)
        }
    }


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataSend((prev) => (
            { ...prev, [name]: value }
        ))

    }

    const handleChangeDate = (date: string | Date | null, mode: "payment_due" | "paymenting") => {
        if (!date) return;
        const formattedDate = moment(date).format("YYYY-MM-DD"); // "2025-08-29"
        console.log({ formattedDate });

        if (mode === "payment_due") {
            setDataSend((prev) => ({
                ...prev,
                payment_date: formattedDate ? formattedDate : "",
            }));
        }

        if (mode === "paymenting") {
            setDataSend((prev) => ({
                ...prev,
                payment_day: formattedDate ? formattedDate : "",
            }));
        }


    };

    const handleDelete = async () => {
        const result = await AlertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้จริงหรือไม่ ?')
        if (!result) return
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

    const handlePay = async (value: string) => {
        const statusPay = Number(value)

        try {
            if (status == "authenticated") {
                if (statusPay === 2) {
                    const user_id = session.user.id
                    const payload = {
                        user_id: user_id,
                        payment_day: dataSend.payment_day

                    }

                    const res = await api.put(`/bill/${process.env.NEXT_PUBLIC_V}/${dataSend.id}/pay`, payload)

                    if (res.status === 200) {
                        toast.success('ลบสำเร็จ')
                        await fetchData()
                        clearStateSave()
                    }
                } else {
                    await handleSave(statusPay)
                }

            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        // if(status !== "authenticated") return
        fetchData()
        fetchOptions()
    }, [page, currentPage, startDate, endDate, data?.length, overdue.length, searchMember, searchBillNumber])

    useEffect(() => {
        if (dataSend.member_id && dataSend.member_name) {
            setSelected({ value: String(dataSend.member_id), label: dataSend.member_name })
        }
    }, [dataSend.member_id, dataSend.member_name])



    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between  gap-4'>
                <div className='flex flex-wrap gap-4'>
                    <Button label='ต้องจ่ายวันนี้' className='h-10' shape="rounded" variant={`${page === 1 ? "red" : "outlineRed"}`} onClick={() => {setPage(1); clearStateSave() }} />
                    <Button label='เพิ่มใหม่' className='h-10' shape="rounded" variant={`${page === 2 ? "primary" : "outlinePrimary"}`} onClick={() => {setPage(2); clearStateSave() }} />
                    <Button label='จ่ายแล้ว' className='h-10' shape="rounded" variant={`${page === 3 ? "green" : "outlineGreen"}`} onClick={() => {setPage(3); clearStateSave() }} />
                </div>

                <div className='w-full md:w-fit'>
                    <Button onClick={clearStateSave} label='เคลียค่า' className='h-9 w-full' shape="rounded" variant="primary" />
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 mt-6'>
                <Card className='w-full md:w-7/12'>
                    {page === 1 && (
                        <InputGroup
                            className="w-full sm:w-1/2"
                            type="text"
                            name="bill_number"
                            label="ค้นหาจาก เลขที่บิล"
                            placeholder="ค้นหาจากเลขที่บิล"
                            height="sm"
                            value={searchBillNumber}
                            onChange={(e) => setSearchBillNumber(e.target.value)}
                        />
                    )}

                    {page === 2 && (
                        <div className='mb-4 flex flex-col md:flex-row gap-4 items-center md:items-end'>
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="bill_number"
                                label="ค้นหาจาก เลขที่บิล"
                                placeholder="ค้นหาจากเลขที่บิล"
                                height="sm"
                                value={searchBillNumber}
                                onChange={(e) => setSearchBillNumber(e.target.value)}
                            />
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="bill_number"
                                label="ค้นหาจากชื่อลูกค้า"
                                placeholder="ค้นหาจาก ชื่อลูกค้า"
                                height="sm"
                                value={searchMember}
                                onChange={(e) => setSearchMember(e.target.value)} />
                        </div>
                    )}

                    {(page === 3) && (
                        <div className='mb-4 flex flex-col md:flex-row gap-4 items-center md:items-end'>
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

                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="bill_number"
                                label="ค้นหาจาก เลขที่บิล"
                                placeholder="ค้นหาจากเลขที่บิล"
                                height="sm"
                                value={searchBillNumber}
                                onChange={(e) => setSearchBillNumber(e.target.value)}
                            />
                            <Button onClick={clearStateSave} label='ทั้งหมด' className='h-9' shape="rounded" variant="primary" />
                        </div>
                    )}

                    {Array.isArray(due_today) && page === 1 ?
                        <Today
                            due_today={due_today ? due_today : []}
                            overdue={overdue ? overdue : []}
                            totalPageProp={totalPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setDataSend={setDataSend}
                            index={index}
                            setIndex={setIndex}
                        /> :
                        Array.isArray(data) && page === 2 ?
                            <Add
                                dataProps={Array.isArray(data) ? data : []}
                                totalPageProp={totalPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setDataSend={setDataSend}
                                index={index}
                                setIndex={setIndex}
                            /> :
                            Array.isArray(data) && page === 3 ?
                                <Success
                                    dataProps={Array.isArray(data) ? data : []}
                                    totalPageProp={totalPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    setDataSend={setDataSend}
                                    index={index}
                                    setIndex={setIndex}
                                /> : ""}

                </Card>
                <div className='w-full md:w-5/12'>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Card className='w-full border-l-8 border-red-700'>
                            <span>จำนวน</span>
                            <div className='flex gap-2 justify-end items-center  '>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>{unpaid_bill_count || 0}</h2>
                                <span>รายการ</span>
                            </div>
                        </Card>
                        <Card className='w-full  border-l-8 border-green-700'>
                            <span>ราคา</span>
                            <div className='flex gap-2 justify-end items-center'>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>{formatNumber(total_outstanding || 0)}</h2>
                                <span>บาท</span>
                            </div>
                        </Card>
                    </div>
                    <Card className='mt-4'>
                        <div className='flex justify-between'>
                            <h3 className='text-dark-2 dark:text-dark-8 text-xl'>เพิ่ม/แก้ไข</h3>
                            <p >
                                <span className={`${dataSend.id ? dataSend.status === 2 ? "bg-green-600" : "bg-red-400" : ""} px-4 py-0.5 rounded-md text-dark-8`}>
                                    {dataSend.id ? dataSend.status === 2 ? "ชำระงินแล้ว" : "ยังไม่ชำระเงิน" : ""}
                                </span>
                            </p>
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row mt-4">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="bill_number"
                                label="เลขที่บิล"
                                placeholder=""
                                height="sm"
                                value={dataSend?.bill_number ?? ""}
                                onChange={handleChangeInput}
                                disabled={!!dataSend.id}
                            />

                            <div className="w-full sm:w-1/2">
                                <label htmlFor="" className='text-sm text-dark-3   '>ค้นหาลูกค้า</label>
                                <SelectReact
                                    isDisabled={session?.user.role_id !== 1 && !!dataSend.id}
                                    options={options}
                                    value={selected}
                                    onChange={(newValue) => {
                                        setSelected(newValue as OptionType | null);
                                    }}
                                    isClearable
                                    className='mt-4'
                                />
                            </div>
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row ">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="สร้างวันที่"
                                placeholder={dataSend.created_at ? formathDateThai(dataSend.created_at) : ""}
                                disabled
                                height="sm"
                            />
                            <DatePickerOne label="ครบกำหนดชำระ" name="payment_date"
                                onChange={(date) => handleChangeDate(date, "payment_due")}
                                value={dataSend.payment_date}
                                disabled={session?.user.role_id !== 1 && !!dataSend.id}
                            />
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row ">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="payment_amount"
                                label="จำนวนเงิน"
                                placeholder="500.00"
                                height="sm"
                                value={String(dataSend?.payment_amount) ?? ""}
                                onChange={handleChangeInput}
                                disabled={session?.user.role_id !== 1 && !!dataSend.id}
                            />

                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="พนักงานที่กดบันทึก"
                                placeholder=""
                                disabled
                                height="sm"
                                value={dataSend.member_name ? dataSend.member_name : ""}
                            />
                        </div>

                        {dataSend.id ? (
                            <div className='flex flex-col md:flex-row gap-4'>

                                <DatePickerOne label="วันที่ชำระ" name="payment_day"
                                    onChange={(date) => handleChangeDate(date, "paymenting")}
                                    value={dataSend.payment_day === "0001-01-01" ? dateNow : dataSend.payment_day}
                                    disabled={!!dataSend.id && dataSend.status === 2}
                                />

                                <Select
                                    label="ชำระเงิน"
                                    items={[
                                        { label: "ยังไม่ชำระเงิน", value: "1" },
                                        { label: "ชำระเงินแล้ว", value: "2" },
                                    ]}
                                    onChange={handlePay}
                                    value={dataSend.status ? dataSend.status.toString() : "2"}
                                    prefixIcon={""}
                                    placeholder="เลือก"
                                    className='w-full'
                                />


                            </div>
                        ) : ""}

                        <hr className='my-6' />

                        <div className='flex justify-end gap-4 items-end'>

                            {session?.user.role_id === 1 && dataSend.id ? <Button onClick={handleDelete} label={`ลบ`} className='h-9' shape="rounded" variant="red" /> : ""}
                            {session?.user.role_id === 1 && <Button onClick={() => handleSave()} label={`${!dataSend.id ? "บันทึก" : "แก้ไข"}`} className='h-9' shape="rounded" variant="primary" />}
                            {session?.user.role_id === 2 && !dataSend.id && <Button onClick={() => handleSave()} label={`บันทึก`} className='h-9' shape="rounded" variant="primary" />}

                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PageProcess
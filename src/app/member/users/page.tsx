"use client";

import React, { useEffect, useState } from 'react'
import { CallIcon, MessageOutlineIcon, PencilSquareIcon, UserIcon } from '@/assets/icons'
import InputGroup from '@/components/FormElements/InputGroup'
import { getTopProducts } from '@/components/Tables/fetch'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { AlertConfirm, formathDateThai } from '@/lib/utils';
import { TopChannels } from '@/components/Tables/top-channels';
import { Switch } from '@/components/FormElements/switch';
import { api, handleAxiosError } from '@/utils/api';

interface dataType {
  id: number
  full_name: string
  tel: string
  created_at: string
}

const PageUsers = () => {
  const [data, setData] = useState<dataType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [search, setSearch] = useState("")
  const [index, setIndex] = useState<number | null>(null)

  const [dataSend, setDataSend] = useState<dataType>({
    id: 0,
    full_name: "",
    tel: "",
    created_at: ""
  })

  // System

  const handleChangeStatus = (value: boolean) => {
    setDataSend((prev) => ({ ...prev, is_active: value }))
  }

  const clearStateSave = () => {
    setDataSend({
      id: 0,
      full_name: "",
      tel: "",
      created_at: ""

    })
  }

  const handleDelete = async () => {
    const result = await AlertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้จริงหรือไม่ ?')
    if (!result) return
    try {
      const res = await api.delete(`/members/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`)
      console.log(res);

      if (res.status === 204) {
        toast.success('ทำรายการสำเร็จ')
        await fetchData()

      }
    } catch (error) {
      handleAxiosError(error)
    }

  }

  const fetchData = async () => {
    try {
      const res = await api.get(`/members/${process.env.NEXT_PUBLIC_V}/all`, {
        params: { page, limit: 8, search }
      })
      if (res.status === 200) {
        console.log(res.data);

        setData(res.data.results)
        setPage(res.data.current_page)
        setTotalPage(res.data.total_pages)
      }

    } catch (error) {
      handleAxiosError(error)
    }
  }

  const fetchDataById = async (id: number) => {
    try {
      if (!id) return toast.error('ไม่พบ ID')
      const res = await api.get(`/members/${process.env.NEXT_PUBLIC_V}/${id}`)
      if (res.status === 200) {
        console.log(res.data);
        setDataSend(res.data)
      }
    } catch (error) {
      handleAxiosError(error)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        full_name: dataSend.full_name,
        tel: dataSend.tel,
      }
      console.log(payload);

      if (!dataSend.id) {
        const res = await api.post(`/members/${process.env.NEXT_PUBLIC_V}/create`, payload)
        if (res.status === 200 || res.status === 201) {
          toast.success('บันทึกสำเร็จ')
          await fetchData()
          clearStateSave()
        }

      } else {

        const res = await api.put(`/members/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`, payload)
        if (res.status === 200) {
          toast.success('บันทึกสำเร็จ')
          await fetchData()
        }

      }


    } catch (error) {
      handleAxiosError(error)
    }
  }



  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataSend((prev) => (
      { ...prev, [name]: value }
    ))

  }

  useEffect(() => {
    fetchData();
  }, [page, search]);

  return (
    <div className='flex flex-col md:flex-row gap-4'>

      <Card className="w-full md:w-8/12">
        <div className='mb-4 flex flex-col md:flex-row gap-4 items-center '>
          <h3 className='text-xl text-dark-2 dark:text-dark-8'>ข้อมูลพนักงาน</h3>
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            label=""
            placeholder="ค้นหา"
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid mt-6  dark:bg-gray-dark dark:shadow-card    ">
          <Table>
            <TableHeader>
              <TableRow className="border-none uppercase [&>th]:text-center">
                <TableHead className="min-w-[120px] !text-left">ชื่อ-สกุล</TableHead>
                <TableHead>เบอร์โทรศัพท์</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item, i) => (
                <TableRow
                  className={`text-center text-base font-medium text-dark dark:text-white cursor-pointer ${index === item.id ? "bg-gray-200/50" : ""}`}
                  key={item.id}
                  onClick={() => {fetchDataById(item.id); setIndex(item.id)}}
                >
                  <TableCell className="flex min-w-fit items-center gap-3">
                    <div className="">{item.full_name}</div>
                  </TableCell>
                  <TableCell>{item.tel || "-"} </TableCell>
                  <TableCell className='flex justify-center items-center cursor-pointer'><PencilSquareIcon onClick={() => {fetchDataById(item.id); setIndex(item.id)}} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPage}
          onPageChange={(p) => setPage(p)}
          className="mt-4 flex justify-end"
        />
      </Card>
      <Card className="w-full md:w-4/12" >
        <div className='mb-4 flex justify-between items-center'>
          <h3 className='text-xl text-dark-2 dark:text-dark-8'>เพิ่ม/แก้ไข </h3>
          <Button label="เพิ่มข้อมูลใหม่" variant="primary" shape="rounded" size="small" className='h-9' onClick={() => clearStateSave()} disabled={!dataSend.id} />
        </div>
        <form onSubmit={handleSave} >
          <div className="mb-5.5 flex flex-col gap-4">
            <InputGroup
              className="w-full "
              type="text"
              name="full_name"
              label="ชื่อลูกค้า"
              placeholder="กรอกชื่อ-สกุล"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
              value={dataSend?.full_name ?? ""}
              onChange={handleChangeInput}

            />

            <InputGroup
              className="w-full "
              type="text"
              name="tel"
              label="เบอร์โทรศัพท์"
              placeholder="กรอกเบอร์โทรศัพท์"
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
              value={dataSend?.tel ?? ""}
              onChange={handleChangeInput}
            />
          </div>

          <hr className='my-6' />

          <div className='flex justify-end gap-2 '>
            {dataSend.id ? (<Button label="ลบ" variant="red" shape="rounded" size="small" className='h-9' onClick={handleDelete} />) : ""}
            <Button type="submit" label={`${!dataSend.id ? "บันทึก" : "อัพเดท"}`} variant="primary" shape="rounded" size="small" className='h-9' />
          </div>

        </form>
      </Card>
    </div>
  )
}

export default PageUsers


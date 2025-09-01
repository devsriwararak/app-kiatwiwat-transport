"use client";

import React, { useEffect, useState } from 'react'
import { CallIcon, PencilSquareIcon, UserIcon } from '@/assets/icons'
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
import { useSession } from 'next-auth/react';

interface dataType {
  id: number
  full_name: string
  username: string
  password: string
  created_at: string
  is_active: boolean
}

const PageMember = () => {
  const [data, setData] = useState<dataType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [search, setSearch] = useState("")


  const [enabled, setEnabled] = useState(false);
  const [dataSend, setDataSend] = useState<dataType>({
    id: 0,
    full_name: "",
    username: "",
    password: "",
    created_at: "",
    is_active: true
  })

  // System

  const handleChangeStatus = (value: boolean) => {
    setDataSend((prev) => ({ ...prev, is_active: value }))
  }

  const clearStateSave = () => {
    setDataSend({
      id: 0,
      full_name: "",
      username: "",
      password: "",
      created_at: "",
      is_active: true
    })
  }

  const handleDelete = async () => {
    const result = await AlertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้จริงหรือไม่ ?')
    if (!result) return
    try {
      const res = await api.delete(`/users/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`)
      if (res.status === 200) {
        toast.success('ทำรายการสำเร็จ')
        await fetchData()

      }
    } catch (error) {
      handleAxiosError(error)
    }

  }

  const fetchData = async () => {
    try {
      const res = await api.get(`/users/${process.env.NEXT_PUBLIC_V}/all`, {
        params: { page, limit: 6, search }
      })
      if (res.status === 200) {
        console.log(res.data);

        setData(res.data.data)
        setPage(res.data.pagination.current_page)
        setTotalPage(res.data.pagination.total_pages)

      }

    } catch (error) {
      handleAxiosError(error)
    }
  }

  const fetchDataById = async (id: number) => {
    try {
      if (!id) return toast.error('ไม่พบ ID')
      const res = await api.get(`/users/${process.env.NEXT_PUBLIC_V}/${id}`)
      if (res.status === 200) {
        console.log(res.data.data);
        setDataSend(res.data.data)
      }
    } catch (error) {
      handleAxiosError(error)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        username: dataSend.username,
        full_name: dataSend.full_name,
        password: dataSend.password,
        is_active: dataSend.is_active
      }
      console.log(payload);

      if (!dataSend.id) {
        const res = await api.post(`/users/${process.env.NEXT_PUBLIC_V}/create`, payload)
        if (res.status === 200) {
          toast.success('บันทึกสำเร็จ')
          await fetchData()
          clearStateSave()
        }

      } else {

        const res = await api.put(`/users/${process.env.NEXT_PUBLIC_V}/${dataSend.id}`, payload)
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
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, i) => (
                <TableRow
                  className="text-center text-base font-medium text-dark dark:text-white"
                  key={item.id}
                >
                  <TableCell className="flex min-w-fit items-center gap-3">
                    <div className="">{item.full_name}</div>
                  </TableCell>
                  <TableCell>- </TableCell>
                  <TableCell>{formathDateThai(item.created_at) }</TableCell>

                  <TableCell>{item.username}</TableCell>
                  <TableCell className='flex justify-center items-center cursor-pointer'><PencilSquareIcon onClick={() => fetchDataById(item.id)} /></TableCell>
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
          <h3 className='text-xl text-dark-2 dark:text-dark-8'>เพิ่ม/แก้ไข {dataSend?.id}</h3>
          <Button label="เพิ่มข้อมูล" variant="primary" shape="rounded" size="small" className='h-9' onClick={() => clearStateSave()} disabled={!dataSend.id} />

        </div>
        <form onSubmit={handleSave} >
          <div className="mb-5.5 flex flex-col gap-2 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="full_name"
              label="ชื่อ-สกุล"
              placeholder="กรอกชื่อ-สกุล"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
              value={dataSend?.full_name ?? ""}
              onChange={handleChangeInput}

            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="phoneNumber"
              label="เบอร์โทรศัพท์"
              placeholder="กรอกเบอร์โทรศัพท์"
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-2 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="username"
              label="Username"
              placeholder="Username"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
              value={dataSend?.username ?? ""}
              onChange={handleChangeInput}
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="password"
              label="Password"
              placeholder="Password"
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
              value={dataSend?.password ?? ""}
              onChange={handleChangeInput}
            />
          </div>

          <div className='flex gap-2 justify-center items-center'>
            <label htmlFor="">
              <span className={`${dataSend.is_active ? "bg-green-200" : "bg-red-200"} text-dark-3 px-4 py-0.5 rounded-md`}>
                {dataSend.is_active ? "อยู่ในระบบ" : "ให้ออกจากระบบ"}
              </span>
            </label>
            <Switch checked={dataSend.is_active} onChange={handleChangeStatus} />
          </div>
          <hr className='my-6' />

          <div className='flex justify-end gap-2 '>
            <Button label="ลบ" variant="red" shape="rounded" size="small" className='h-9' onClick={handleDelete} />
            <Button type="submit" label={`${!dataSend.id ? "บันทึก" : "อัพเดท"}`} variant="primary" shape="rounded" size="small" className='h-9' />
          </div>

        </form>
      </Card>
    </div>
  )
}

export default PageMember
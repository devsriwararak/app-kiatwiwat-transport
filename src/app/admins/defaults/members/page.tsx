"use client";

import React, { useEffect, useState } from 'react'
import { CallIcon, UserIcon } from '@/assets/icons'
import InputGroup from '@/components/FormElements/InputGroup'
import { getTopProducts } from '@/components/Tables/fetch'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { AlertConfirm } from '@/lib/utils';
import { TopChannels } from '@/components/Tables/top-channels';
import { Switch } from '@/components/FormElements/switch';

const PageMember = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
   const [enabled, setEnabled] = useState(false);

  const handleChangeStatus = (value : boolean) => {
    toast.success('Success'+ value)
     setEnabled(value); 
  }

  const handleDelete = async () => {
    const result = await AlertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้จริงหรือไม่ ?')
    if (result) toast.success('Success')

  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTopProducts();
      setData(res);
    };
    fetchData();
  }, [page]);

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <Card className="w-full md:w-8/12">
        <div className='mb-4 flex flex-col md:flex-row gap-4 items-center '>
          <h3 className='text-xl text-dark-2 dark:text-dark-8'>ข้อมูลพนักงาน</h3>
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="fullName"
            label=""
            placeholder="ค้นหา"
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="grid mt-6  dark:bg-gray-dark dark:shadow-card    ">
          <Table>
            <TableHeader>
              <TableRow className="border-none uppercase [&>th]:text-center">
                <TableHead className="min-w-[120px] !text-left">Source</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((channel, i) => (
                <TableRow
                  className="text-center text-base font-medium text-dark dark:text-white"
                  key={channel.name + i}
                >
                  <TableCell className="flex min-w-fit items-center gap-3">
                    <div className="">{channel.name}</div>
                  </TableCell>
                  <TableCell>{channel.sales}</TableCell>
                  <TableCell>{channel.conversion}%</TableCell>
                  <TableCell>{channel.conversion}%</TableCell>
                  <TableCell>{channel.conversion}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={(p) => setPage(p)}
          className="mt-4 flex justify-end"
        />
      </Card>

      <Card className="w-full md:w-4/12" >
        <div className='mb-4'>
          <h3 className='text-xl text-dark-2 dark:text-dark-8'>เพิ่ม/แก้ไข</h3>
        </div>
        <form >
          <div className="mb-5.5 flex flex-col gap-2 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="fullName"
              label="ชื่อ-สกุล"
              placeholder="กรอกชื่อ-สกุล"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
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
              name="fullName"
              label="Username"
              placeholder="Username"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="phoneNumber"
              label="Password"
              placeholder="Password"
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <div className='flex gap-2 justify-center items-center'>
            <label htmlFor="">
              <span className='bg-green-200 text-dark-3 px-4 py-0.5 rounded-md'>
                {!enabled  ?  "อยู่ในระบบ" : "ให้ออกจากระบบ"}
              </span>
            </label>
            <Switch  checked={enabled} onChange={handleChangeStatus}  />
          </div>
          <hr className='my-6' />

          <div className='flex justify-end gap-2 '>
            <Button label="ลบ" variant="outlineRed" shape="rounded" size="small" className='h-9' onClick={handleDelete} />
            <Button type="submit" label="บันทึก" variant="primary" shape="rounded" size="small" className='h-9' />
          </div>

        </form>
      </Card>
    </div>
  )
}

export default PageMember
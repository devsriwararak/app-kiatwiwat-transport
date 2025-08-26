"use client";

import React, { useEffect, useState } from 'react'
import { ArrowUpIcon, CallIcon, GlobeIcon, UserIcon } from '@/assets/icons'
import InputGroup from '@/components/FormElements/InputGroup'
import { getTopProducts } from '@/components/Tables/fetch'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { SettingsIcon } from '@/components/Layouts/header/user-info/icons';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const PageProducts = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [enabled, setEnabled] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getTopProducts();
      setData(res);
    };
    fetchData();
  }, [page]);

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <Card className="w-full md:w-8/12" title="ข้อมูลสินค้า">
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
                  <Image
                    src={product.image}
                    className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                    width={60}
                    height={50}
                    alt={"Image for product " + product.name}
                    role="presentation"
                  />
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
      </Card>

      <Card className="w-full md:w-4/12" title="เพิ่ม/แก้ไข">
        <form >
          <div className="mb-5.5 flex flex-col gap-2 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="fullName"
              label="รหัสสินค้า"
              placeholder="A0001"
              icon={<GlobeIcon />}
              iconPosition="left"
              height="sm"
              disabled
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="phoneNumber"
              label="ชื่อสินค้า"
              placeholder="กรอกชื่อสินค้า"
              icon={<ArrowUpIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-2 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="number"
              name="fullName"
              label="ราคา"
              placeholder="0.00 บาท"
              icon={<SettingsIcon />}
              iconPosition="left"
              height="sm"
            />

 
            <ToggleSwitch checked={enabled}
              onChange={setEnabled}
              title = "สถานะ (มีสินค้าอยู่ไหม ?)"
              label={`(${enabled ? "มีของ": "ไม่มีของ"})`} 
              className=''
              />
              
          </div>

          <div className='flex justify-end gap-2'>
            <Button label="ยกเลิก" variant="outlinePrimary" shape="rounded" size="small" />
            <Button label="บันทึก" variant="primary" shape="rounded" size="small" />
          </div>

        </form>
      </Card>
    </div>
  )
}

export default PageProducts


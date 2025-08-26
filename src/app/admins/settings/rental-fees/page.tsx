'use client'
import InputGroup from '@/components/FormElements/InputGroup'
import { Select } from '@/components/FormElements/select'
import { ShowcaseSection } from '@/components/Layouts/showcase-section'
import { getTopProducts } from '@/components/Tables/fetch'
import { Button } from '@/components/ui-elements/button'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useEffect, useState } from 'react'

const PageRentalFees = () => {

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTopProducts();
      setData(res);
    };
    fetchData();
  }, [page]);

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className='w-full md:w-7/12'>
        <ShowcaseSection title="ตั้งค่า ส่วนลด-ปิดงวดก่นเวลา" className="space-y-5.5 !p-6.5">

          <div className='flex flex-col md:flex-row gap-4 items-end '>
            <Select
              label="เลือกเดือน"
              items={[
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "8", value: "8" },
                { label: "9", value: "9" },
                { label: "10", value: "10" },
              ]}
              defaultValue="2"
              prefixIcon={""}
              className='w-2/12'
            />
            <InputGroup
              label="ส่วนลด (บาท)"
              placeholder="0.00"
              type="number"
              className='w-3/12'
            />
            <div className='flex justify-end gap-2'>
              <Button label="ยกเลิก" variant="outlinePrimary" shape="rounded" size="small" className='h-10' />
              <Button label="บันทึก" variant="primary" shape="rounded" size="small" className='h-10' />
            </div>
          </div>

          <Table className='mt-4'>
            <TableHeader>
              <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                  Product Name
                </TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product) => (
                <TableRow
                  className="text-base font-medium text-dark dark:text-white"
                  key={product.name + product.profit}
                >
                  <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                    <div>{product.name}</div>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={(p) => setPage(p)}
            className="mt-8 flex justify-end"
          />
        </ShowcaseSection>
      </div>

      <div className='w-full md:w-5/12 flex flex-col gap-4'>
        <ShowcaseSection title="ตั้งค่า จำนวนสันผ่อน" className="space-y-5.5 !p-6.5 ">
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex flex-col justify-start items-start gap-5 w-full '>     
               <InputGroup
              label=""
              placeholder="0"
              type="number"
            />
              <div className='flex justify-end gap-2'>
                <Button label="ยกเลิก" variant="outlinePrimary" shape="rounded" size="small" className='h-10' />
                <Button label="บันทึก" variant="primary" shape="rounded" size="small" className='h-10' />
              </div>
            </div>
            <div className='w-full  border-l border-gray-200 px-4      '>
              <ul className="overflow-y-scroll h-40">
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
                <li>xxx แก้ไข/ลบ</li>
              </ul>
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="ตั้งค่า ค่าปรับ" className="space-y-5.5 !p-6.5  ">
          <InputGroup
            label=""
            placeholder="0.00"
            type="text"
          />
          <div className='flex justify-end gap-2'>
            <Button label="ยกเลิก" variant="outlinePrimary" shape="rounded" size="small" className='h-10' />
            <Button label="บันทึก" variant="primary" shape="rounded" size="small" className='h-10' />
          </div>
        </ShowcaseSection>
      </div>
    </div>
  )
}

export default PageRentalFees


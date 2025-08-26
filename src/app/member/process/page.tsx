'use client'

import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import React, { useState } from 'react'
import Today from './pages/Today'
import Add from './pages/Add'
import Success from './pages/Success'
import InputGroup from '@/components/FormElements/InputGroup'
import { CallIcon, CheckIcon, UploadIcon, UserIcon } from '@/assets/icons'
import DatePickerTwo from '@/components/FormElements/DatePicker/DatePickerTwo'
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import { BellIcon } from '@/components/Layouts/header/notification/icons'

const PageProcess = () => {
    const [page, setPage] = useState<number>(1)
    return (
        <div>
            <div className='flex gap-4'>
                <Button label='ต้องจ่ายวันนี้' className='h-10' shape="rounded" variant="red" onClick={() => setPage(1)} />
                <Button label='เพิ่มใหม่' className='h-10' shape="rounded" variant="primary" onClick={() => setPage(2)} />
                <Button label='จ่ายแล้ว' className='h-10' shape="rounded" variant="green" onClick={() => setPage(3)} />
            </div>

            <div className='flex flex-col md:flex-row gap-4 mt-6'>
                <Card className='w-full md:w-7/12'>
                    {page === 1 ? <Today /> : page === 2 ? <Add /> : page === 3 ? <Success /> : ""}

                </Card>
                <div className='w-full md:w-5/12'>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Card className='w-full'>
                            <span>จำนวน</span>
                            <div className='flex gap-2 justify-end items-center  '>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>20</h2>
                                <span>คน</span>
                            </div>
                        </Card>
                        <Card className='w-full'>
                            <span>ราคา</span>
                            <div className='flex gap-2 justify-end items-center'>
                                <h2 className='text-3xl text-dark-2 dark:text-dark-8'>0.00</h2>
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
                            />
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="phoneNumber"
                                label="ลูกค้า"
                                placeholder="ลูกค้า"
                                icon={<CallIcon />}
                                iconPosition="left"
                                height="sm"
                            />
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
                            <DatePickerOne label="ชำระวันที่" />
                        </div>

                        <div className="mb-3 flex flex-col gap-2 sm:flex-row ">
                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="จำนวนเงิน"
                                placeholder="500.00"
                                icon={<CheckIcon />}
                                iconPosition="left"
                                height="sm"
                            />

                            <InputGroup
                                className="w-full sm:w-1/2"
                                type="text"
                                name="fullName"
                                label="พนักงานที่กดบันทึก"
                                placeholder="พนักงาน A001"
                                icon={<BellIcon />}
                                iconPosition="left"
                                disabled
                                height="sm"
                            />
                        </div>

                        <hr className='my-6' />

                        <div className='flex justify-end'>
                            <Button label='บันทึก' className='h-9' shape="rounded" variant="primary" />
                        </div>

                    </Card>



                </div>
            </div>
        </div>
    )
}

export default PageProcess
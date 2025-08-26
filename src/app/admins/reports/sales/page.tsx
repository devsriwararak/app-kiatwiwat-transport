import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import { ShowcaseSection } from '@/components/Layouts/showcase-section'
import React, { Suspense } from 'react'
import { OverviewCardsSkeleton } from '../../home/_components/overview-cards/skeleton'
import { OverviewCardsGroup } from '../../home/_components/overview-cards'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui-elements/button'
import { TopChannelsSkeleton } from '@/components/Tables/top-channels/skeleton'
import { TopChannels } from '@/components/Tables/top-channels'
import { ChatsCard } from '../../home/_components/chats-card'

const PageSales = () => {
  return (
    <div>
      <Card  className=" ">
        <div className='flex justify-between items-end gap-4  w-full'>
          <div className='flex gap-4 w-full '>
            <DatePickerOne label='วันที่เริ่มต้น' />
            <DatePickerOne label='วันที่่สิ้นสุด' />
          </div>
          <div className='flex justify-end items-end  '>
            <Button label='Excel' size="small" shape="rounded" className='h-10 bg-green-700' />
          </div>
        </div>
      </Card>

      <div className='py-5'>
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCardsGroup />
        </Suspense>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>

        <div className='w-2/3'>
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels title='สินค้าขายดี' />
          </Suspense>
        </div>

        <div className='w-1/3'>
          <Suspense fallback={null}>
            <ChatsCard title="ลูกค้าดีเด่น" />
          </Suspense>
        </div>

      </div>




    </div>
  )
}

export default PageSales
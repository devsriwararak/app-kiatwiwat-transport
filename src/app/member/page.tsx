import React, { useEffect } from 'react'
import { redirect, RedirectType } from 'next/navigation'


const pageMember = () => {
redirect('/member/process', RedirectType.replace)
  return (
    <></>
  )
}

export default pageMember


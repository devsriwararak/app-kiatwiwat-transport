import React, { useEffect } from 'react'
import { redirect, RedirectType } from 'next/navigation'


const PageAdmin = () => {
redirect('/member/process', RedirectType.replace)
  return (
    <></>
  )
}

export default PageAdmin
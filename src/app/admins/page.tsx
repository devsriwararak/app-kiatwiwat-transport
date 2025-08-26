import React, { useEffect } from 'react'
import { redirect, RedirectType } from 'next/navigation'


const PageAdmin = () => {
redirect('/admins/reports/sales', RedirectType.replace)
  return (
    <></>
  )
}

export default PageAdmin
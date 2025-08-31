import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge"
import 'moment/locale/th'; // นำเข้าภาษาไทย
import { getSession, signOut, useSession } from "next-auth/react";
import { api, handleAxiosError } from "@/utils/api";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const AlertConfirm = (title: string, message: string): Promise<boolean> => {
  return Swal.fire({
    title: title || "",
    showCancelButton: true,
    confirmButtonText: "ลบ",
    confirmButtonColor: "red",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      return true
    } else {
      return false
    }

  });

}


export const formathDateThai = (time: string) => {
  const date = moment.utc(time);
  const formattedDate = date.add(543, 'year').format('D MMM YYYY');
  return formattedDate
}


export const handleLogout = async (user_id: number) => {
  console.log({ handleLogout: user_id });

  try {
    if (!user_id) {
      console.warn("User not logged in");
      // alert('1111')
      console.log('33333333333');

      // signOut({ callbackUrl: '/auth/sign-in' })
      return;
    }
    const res = await api.post(`/auth/${process.env.NEXT_PUBLIC_V}/logout`, { user_id })
    // console.log({ res });
    // if (res.status === 200) {
    //   await signOut({ callbackUrl: '/auth/sign-in' })
    // }
  } catch (error) {
    console.log(error);
    const message = handleAxiosError(error);
    console.log(message);

  } finally {
    console.log('444444444');
    await signOut({ callbackUrl: '/auth/sign-in' })
  }

}

export const formatNumber = (value: number | string): string => {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge"
import 'moment/locale/th'; // นำเข้าภาษาไทย


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

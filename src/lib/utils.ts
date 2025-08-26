import { clsx, type ClassValue } from "clsx"
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge"

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

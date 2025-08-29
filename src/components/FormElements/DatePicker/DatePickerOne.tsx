"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { Thai } from "flatpickr/dist/l10n/th.js";
import moment from "moment";

interface propsType {
  label?: string
  className?: string
  name?: string
  value?: string;

  onChange?: (date: string | Date | null) => void;
}

const DatePickerOne = ({ label, name, onChange, value }: propsType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);



  //  useEffect(() => {
  //   flatpickr(".form-datepicker", {
  //     mode: "single",
  //     dateFormat: "d M Y", // แสดงวันที่แบบ 01 ม.ค. 2566
  //     locale: {
  //       ...Thai,
  //       firstDayOfWeek: 1, // อาทิตย์เป็นวันแรก
  //       weekdays: {
  //         shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  //         longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
  //       },
  //       months: {
  //         shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
  //         longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
  //       },
  //     },
  //     onChange: (selectedDates) => {
  //       // if (!selectedDates.length) return;
  //       // const d = selectedDates[0];
  //       // // แปลงเป็นปี พ.ศ.
  //       // const buddhistYear = d.getFullYear() + 543;
  //       // const month = String(d.getMonth() + 1).padStart(2, "0");
  //       // const day = String(d.getDate()).padStart(2, "0");
  //       // onChange?.(`${buddhistYear}-${month}-${day}`);
  //        if (!selectedDates.length) return;
  //   const d = selectedDates[0];
  //   const formattedDate = moment(d).format("YYYY-MM-DD"); // ปีสากล
  //   onChange?.(formattedDate);
  //     },
  //   });
  // }, []);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: "single",
        dateFormat: "d M Y", // แสดงวันที่แบบ 01 ม.ค. 2566
        defaultDate: new Date(),
        locale: {
          ...Thai,
          firstDayOfWeek: 1, // อาทิตย์เป็นวันแรก
          weekdays: {
            shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
            longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
          },
          months: {
            shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
          },
        },
        onChange: (selectedDates) => {
          if (!selectedDates.length) return;
          const d = selectedDates[0];
          const formattedDate = moment(d).format("YYYY-MM-DD"); // ปีสากล
          onChange?.(formattedDate);
        },
      });
    }

  }, []);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="relative ">
        <input
        ref={inputRef}
          className="form-datepicker w-full rounded-[7px]  border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="mm/dd/yyyy"
          data-class="flatpickr-right"
          name={name}
          defaultValue={value}
          readOnly
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;

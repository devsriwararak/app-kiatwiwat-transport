import { cn } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui-elements/button';
import { MessageOutlineIcon, NextIcon, PrevIcon, TrashIcon } from '@/assets/icons';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {

    if (totalPages <= 1) return null
    // const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | string)[] = []
    const windowSize = 3

    //หา block ปัจจุบัน
    const currentBlock = Math.ceil(currentPage / windowSize)
    let start = (currentBlock - 1) * windowSize + 1
    let end = Math.min(start + windowSize - 1, totalPages)

    // --- ปรับ start/end เวลาย้อนกลับ ---
    // ถ้า currentPage < start ของ block → เลื่อน block ไป
    if (currentPage < start) {
        start = Math.max(currentPage - (windowSize - 1), 1)
        end = start + windowSize - 1
    }
    end = Math.min(end, totalPages)
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // --- ต่อท้ายด้วย ... + หน้าสุดท้าย (ถ้ายังไม่ถึง) ---
    if (end < totalPages) {
        pages.push("...", totalPages);
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                className="px-3 py-1 rounded-md   disabled:opacity-50  text-dark-3 dark:text-dark-7 hover:bg-dark-8"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <PrevIcon />
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={i} className="px-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={i}
                        className={cn(
                            "px-3 py-1 rounded",
                            p === currentPage
                                ? "bg-primary text-white"
                                : " border border-dark-7 hover:bg-primary/20  dark:hover:bg-gray-600"
                        )}
                        onClick={() => onPageChange(p as number)}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="px-3 py-1   disabled:opacity-50 hover:bg-dark-8  text-dark-3 dark:text-dark-7 rounded-md"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <NextIcon />
            </button>
        </div>
    )
}

export default Pagination
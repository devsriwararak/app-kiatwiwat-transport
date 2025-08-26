import { cn } from '@/lib/utils';
import React from 'react'
type Props = {
    children: React.ReactNode;
    className?: string;
    title?: string;
};

const Card = ({ children, className, title }: Props) => {
    return (
        <div className={cn("flex flex-col items-start gap-2 rounded-[10px] bg-white px-6 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card h-fit ", className)}>
            {title && (<h3 className='text-xl text-dark-2 dark:text-dark-8'>{title}</h3>)}
            <div className='mt-4'>{children}</div>
        </div>
    )
}

export default Card
'use client'
import { ShowcaseSection } from '@/components/Layouts/showcase-section';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'

const page = () => {
    const [data, setData] = useState([])
    const { data: session } = useSession();
    const token = session?.accessToken


    const fetchData = useCallback(async () => {
        try {
            if (!token) return;
            console.log(token);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/product-category/v1/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                const refreshedTokens = await res.json();
                console.log(refreshedTokens);
                setData(refreshedTokens.results)
            }

        } catch (error) {
            console.log(error);

        }
    }, [token])

    useEffect(() => {
        fetchData()
    }, [token, fetchData])

    return (
        <div>

            <ShowcaseSection title="หน้าทดสอบ" className="!p-7">
                <ul>
                    {data && data.length > 0 && data.map((item) => (
                        <li>zxxx</li>
                    ))}

                </ul>
            </ShowcaseSection>
        </div>
    )
}

export default page
import Image from "next/image";
import React from "react"

const Spinner = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <Image width={100} height={100} alt="Loading..." src="/spinner.svg"/>
        </div>
    )
}

export default Spinner;
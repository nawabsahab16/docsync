import Image from 'next/image'
import Link from 'next/link'


const Header = ({children}: HeaderProps) => {
  return (
    <div className="header">
     <Link href='/' className="md:flex-1">
       <Image 
         src="/assets/icons/logo.svg"
         alt="Logo with Name"
         width={120}
         height={120}
         className="hidden md:block"
       />

       <Image 
         src="/assets/icons/logo-icon.svg"
         alt="Logo"
         width={32}
         height={32}
         className="mr-2 md:hidden"
       />

     </Link>
       {children}
    </div>
  )
}

export default Header
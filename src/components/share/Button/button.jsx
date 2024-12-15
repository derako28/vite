export const Button = ({type = 'button', label = '', variant = 'primary', size = 'md', className, ...props}) => {
    return <button className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:text-white'} type={type} {...props}>
        {label}
    </button>
}
function ThreeElementCard(props) {

    return (
        <div className='p-5 bg2 col-span-1 rounded-lg'>
            <div className='flex flex-row items-center space-x-5'>
                <div className={`${props.bg} rounded-md p-2.5`}>
                    {props.children}
                </div>

                <div className='flex flex-col items-start'>
                    <h3 className='text-sm text2 font-medium'>{props.title}</h3>
                    <p className='font-medium text-lg'>{props.number}</p>
                </div>
            </div>
        </div>
    )
}

export default ThreeElementCard;
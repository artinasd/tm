function TwoElementButton(props) {

    return (
        <div
            onClick={props.onClick}
            className={`cursor-pointer flex flex-row space-x-3 items-center
            hover:bg-gray-700 rounded-lg w-full p-3 mb-1 transition hover:text-indigo-400
            ${props.isSelected ? 'theme text-white hover:bg-indigo-500 hover:text-white' : 'text3'}`}>
            {props.children}
            <h3 className=''>{props.title}</h3>
        </div>
    )
}

export default TwoElementButton
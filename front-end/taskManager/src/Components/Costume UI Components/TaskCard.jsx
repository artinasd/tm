import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

function TaskCard(props) {

    return (
        <div className='rounded-md bg2 px-5 pt-5 w-96 h-fit'>
            <h3 className='font-extrabold'>{props.title}</h3>
            <br/>

            <div className=''>
                <p className='font-medium text-sm py-1 text3 transition'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            </div>
            <br/>

            <div className='border-t border-t-gray-700 mx-[-20px] flex flex-row items-center justify-center py-1.5 space-x-2'>
                <GroupOutlinedIcon style={{fontSize: '20px', color: '#8D96A1'}}/>
                <p className='text-sm text2 font-light'>Authorized Users</p>
            </div>

            {/*<div className='border-t border-t-gray-600 mx-[-20px] flex flex-row items-center justify-center py-2 space-x-2'>*/}
            {/*    <QuestionAnswerOutlinedIcon style={{fontSize: '20px', color: '#8D96A1'}}/>*/}
            {/*    <p className='text-sm text2 font-light'>Add your review about the task...</p>*/}
            {/*</div>*/}
        </div>
    )
}

export default TaskCard;
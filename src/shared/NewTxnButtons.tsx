import './NewTxnButtons.css';

import iouInIcon from '../assets/iou-in.svg';
import iouOutIcon from '../assets/iou-out.svg';
import payInIcon from '../assets/pay-in.svg';
import payOutIcon from '../assets/pay-out.svg';

interface NewTxnButtonsProps {
    personName?: string;
    onClick: (type: 'iou' | 'pay', direction: 'in' | 'out') => void;
}

const NewTxnButtons = (props: NewTxnButtonsProps) => {
    const onClick = props.onClick;
    const personName = props.personName || 'Someone';

    return (
        <div className="newTxnButtons">
            <button
                className="button top-left"
                onClick={() => onClick('iou', 'out')}
            >
                <img src={iouOutIcon} alt="I owe" />
                <span>I owe {personName}</span>
            </button>
            <button
                className="button top-right"
                onClick={() => onClick('iou', 'in')}
            >
                <img src={iouInIcon} alt="Owes me" />
                <span>{personName} owes me</span>
            </button>
            <button
                className="button bottom-left"
                onClick={() => onClick('pay', 'out')}
            >
                <img src={payOutIcon} alt="I paid" />
                <span>I paid {personName}</span>
            </button>
            <button
                className="button bottom-right"
                onClick={() => onClick('pay', 'in')}
            >
                <img src={payInIcon} alt="Paid me" />
                <span>{personName} paid me</span>
            </button>
        </div>
    );
};

export default NewTxnButtons;

import { FC } from 'react';
import styled from 'styled-components';
interface CheckBox {
    isChecked:boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} 

const Checkbox : FC<CheckBox>  = ({isChecked,onChange}) => {
    return (
        <StyledWrapper>
            <label className="container">
                <input type="checkbox" checked={isChecked} onChange={onChange} />
                <svg viewBox="0 0 64 64" height="1.3em" width="1.3em">
                    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path" />
                </svg>
            </label>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .container {
    cursor: pointer;
  }

  .container input {
    display: none;
  }

  .container svg {
    overflow: visible;
  }

  .path {
    fill: none;
    stroke: black;
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
    stroke-dasharray: 241 9999999;
    stroke-dashoffset: 0;
  }

  .container input:checked ~ svg .path {
    stroke-dasharray: 70.5096664428711 9999999;
    stroke-dashoffset: -262.2723388671875;
  }
  
}
  `;

export default Checkbox;

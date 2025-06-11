import React from 'react';
import {
  AddIcon,
  RemoveIcon,
  FullscreenIcon,
  FullscreenExitIcon,
  PrevIcon,
  NextIcon,
  UpIcon,
  DownIcon,
  BackIcon,
  CloseIcon,
} from './Icons';

export default {
  title: 'Components/Icons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const IconWrapper = ({ children, name }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    margin: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '80px'
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
      {children}
    </div>
    <span style={{ fontSize: '12px', textAlign: 'center' }}>{name}</span>
  </div>
);

export const AllIcons = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <IconWrapper name="AddIcon">
        <AddIcon />
      </IconWrapper>
      <IconWrapper name="RemoveIcon">
        <RemoveIcon />
      </IconWrapper>
      <IconWrapper name="FullscreenIcon">
        <FullscreenIcon />
      </IconWrapper>
      <IconWrapper name="FullscreenExitIcon">
        <FullscreenExitIcon />
      </IconWrapper>
      <IconWrapper name="PrevIcon">
        <PrevIcon />
      </IconWrapper>
      <IconWrapper name="NextIcon">
        <NextIcon />
      </IconWrapper>
      <IconWrapper name="UpIcon">
        <UpIcon />
      </IconWrapper>
      <IconWrapper name="DownIcon">
        <DownIcon />
      </IconWrapper>
      <IconWrapper name="BackIcon">
        <BackIcon />
      </IconWrapper>
      <IconWrapper name="CloseIcon">
        <CloseIcon />
      </IconWrapper>
    </div>
  ),
};

export const NavigationIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <IconWrapper name="Prev">
        <PrevIcon />
      </IconWrapper>
      <IconWrapper name="Next">
        <NextIcon />
      </IconWrapper>
      <IconWrapper name="Up">
        <UpIcon />
      </IconWrapper>
      <IconWrapper name="Down">
        <DownIcon />
      </IconWrapper>
    </div>
  ),
};

export const ActionIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <IconWrapper name="Add">
        <AddIcon />
      </IconWrapper>
      <IconWrapper name="Remove">
        <RemoveIcon />
      </IconWrapper>
      <IconWrapper name="Fullscreen">
        <FullscreenIcon />
      </IconWrapper>
      <IconWrapper name="Close">
        <CloseIcon />
      </IconWrapper>
    </div>
  ),
};

export const IndividualIcons = {
  render: () => (
    <div>
      <h3>AddIcon</h3>
      <AddIcon style={{ fontSize: '32px', color: '#007bff' }} />
      
      <h3>RemoveIcon</h3>
      <RemoveIcon style={{ fontSize: '32px', color: '#dc3545' }} />
      
      <h3>FullscreenIcon</h3>
      <FullscreenIcon style={{ fontSize: '32px', color: '#28a745' }} />
      
      <h3>FullscreenExitIcon</h3>
      <FullscreenExitIcon style={{ fontSize: '32px', color: '#6c757d' }} />
    </div>
  ),
}; 
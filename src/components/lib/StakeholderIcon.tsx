import {
  faCoins,
  faGlobe,
  faPeopleGroup,
  faTruckRampBox,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

type StakeholderIconProps = {
  stakeholderKey: string;
};

export function StakeholderIcon({
  stakeholderKey,
  ...props
}: Omit<FontAwesomeIconProps, 'icon'> & StakeholderIconProps) {
  switch (stakeholderKey) {
    case 'A':
      return <FontAwesomeIcon icon={faTruckRampBox} {...props} />;
    case 'B':
      return <FontAwesomeIcon icon={faCoins} {...props} />;
    case 'C':
      return <FontAwesomeIcon icon={faPeopleGroup} {...props} />;
    case 'D':
      return <FontAwesomeIcon icon={faUserGroup} {...props} />;
    case 'E':
      return <FontAwesomeIcon icon={faGlobe} {...props} />;
    default:
      throw Error('Stakeholder not supported');
  }
}

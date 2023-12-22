import ListingEditModal from 'components/ListingEditModal';
import triggerModal from './triggerModal';
import { ListingModalAction } from './enums';
import ListingDataConfirmationModal from 'components/ListingDataConfirmationModal';
import { GetModalSubmitDataType, Listing } from './types';
import { ListingEditModalProps } from 'components/ListingEditModal/ListingEditModal';
import { ModalProps } from './interfaces';
import styles from 'scss/modules/Modals.module.scss';

type ConfirmListingDataProps = {
  listingToEdit?: Listing;
} & Omit<ListingEditModalProps, 'onSubmit' | 'onClose' | 'listing' | 'modalAction'>;

export const confirmListingData = async ({ listingToEdit, ...rest }: ConfirmListingDataProps) => {
  const modalAction = listingToEdit ? ListingModalAction.Edit : ListingModalAction.CreateNew;

  return modalLoop(
    ListingEditModal,
    {
      modalAction,
      listing: listingToEdit,
      ...rest,
    },
    ListingDataConfirmationModal,
    listingEditData => ({
      listing: listingToEdit,
      listingEditData,
    }),
  );
};

export async function modalLoop<
  MP extends ModalProps<MSD>,
  MSD = GetModalSubmitDataType<MP>,
  CP extends ModalProps<boolean> = ModalProps<boolean>,
>(
  mainModal: React.FC<MP>,
  mainModalProps: Omit<MP, 'onSubmit' | 'onClose'>,
  confirmationModal: React.FC<CP>,
  confirmationModalProps:
    | Omit<CP, 'onSubmit' | 'onClose'>
    | ((data: MSD) => Omit<CP, 'onSubmit' | 'onClose'>),
) {
  let confirmed: boolean | undefined = false;
  let data: MSD | undefined;

  while (confirmed === false) {
    const mainModalClassName = `${mainModalProps.className ?? ''} ${
      !data ? styles.slideFromLeft : styles.slideFromRight
    }`;
    data = await triggerModal(mainModal, {
      ...mainModalProps,
      data,
      className: mainModalClassName,
    });
    if (!data) return;

    const props =
      typeof confirmationModalProps === 'function'
        ? confirmationModalProps(data)
        : confirmationModalProps;

    const confirmationModalClassName = `${props.className ?? ''} ${styles.slideFromLeft}`;
    confirmed = await triggerModal(confirmationModal, {
      ...props,
      className: confirmationModalClassName,
    });

    if (confirmed === undefined) return;
    if (confirmed) return data;
  }
}

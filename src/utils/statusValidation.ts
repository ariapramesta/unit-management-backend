import { Status } from "../../generated/prisma/enums";

export const VALID_STATUS_TRANSITIONS: Record<Status, Status[]> = {
  [Status.available]: [Status.occupied, Status.maintenance],
  [Status.occupied]: [Status.cleaning, Status.maintenance],
  [Status.cleaning]: [Status.available, Status.maintenance],
  [Status.maintenance]: [Status.available, Status.cleaning],
};

export function validateStatusUpdate(currentStatus: Status, newStatus: Status) {
  if (currentStatus === newStatus) {
    return {
      isValid: false,
      error: "New status cannot be same as old status",
    };
  }

  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

  if (!allowedTransitions.includes(newStatus)) {
    return {
      isValid: false,
      error: `Transition ilegal: From ${currentStatus} cannot go directly to ${newStatus}.`,
    };
  }

  return { isValid: true, error: null };
}

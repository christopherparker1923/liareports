import { NumberInput } from "@mantine/core";
import { ManufacturerPart, ProjectPart } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";

export default function PartQuantities({
  part,
  projectNumber,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
    };
  };
  projectNumber: string;
}) {
  const [partQuantities, setPartQuantities] = useState({
    required: part?.quantityRequired || 1,
    ordered: part?.quantityOrdered || 0,
    recieved: part?.quantityRecieved || 0,
    committed: part?.quantityCommitted || 0,
  });
  const utils = api.useContext();
  const { mutate: updateProjectPartQuantities } =
    api.projectParts.updateProjectPartQuantities.useMutation({
      onSuccess: async () => {
        await utils.projects.getProjectChildrenByProjectNumber.invalidate(
          projectNumber
        );
      },
    });
  function handleQuantityChange() {
    if (!part?.id) return;
    updateProjectPartQuantities({
      id: part.id,
      required: partQuantities.required,
      ordered: partQuantities.ordered,
      recieved: partQuantities.recieved,
      committed: partQuantities.committed,
    });
  }
  return (
    <div className="flex flex-row gap-x-1">
      {part?.id && (
        <>
          <NumberInput
            min={0}
            value={partQuantities.required}
            onChange={(e) =>
              setPartQuantities({
                ...partQuantities,
                required: e || 1,
              })
            }
            wrapperProps={{ onBlur: handleQuantityChange }}
            className="w-20"
            noClampOnBlur={true}
          />
          <NumberInput
            min={0}
            value={partQuantities.ordered}
            onChange={(e) =>
              setPartQuantities({
                ...partQuantities,
                ordered: e || 0,
              })
            }
            wrapperProps={{ onBlur: handleQuantityChange }}
            className="w-20"
            noClampOnBlur={true}
          />
          <NumberInput
            min={0}
            value={partQuantities.recieved}
            onChange={(e) =>
              setPartQuantities({
                ...partQuantities,
                recieved: e || 0,
              })
            }
            wrapperProps={{ onBlur: handleQuantityChange }}
            className="w-20"
            noClampOnBlur={true}
          />
          <NumberInput
            min={0}
            value={partQuantities.committed}
            onChange={(e) =>
              setPartQuantities({
                ...partQuantities,
                committed: e || 0,
              })
            }
            wrapperProps={{ onBlur: handleQuantityChange }}
            className="w-20"
            noClampOnBlur={true}
          />
        </>
      )}
    </div>
  );
}

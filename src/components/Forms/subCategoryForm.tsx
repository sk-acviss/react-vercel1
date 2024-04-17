import FormDialogue from "@components/common/formDialogue";
import { useCategoryStore } from "@store/categoryStore";
import React, { useState } from "react";
import DeleteIcon from "@assets/icons/delete.svg";
import EditIcon from "@assets/icons/edit.svg";
import SaveIcon from "@assets/icons/save.svg";
import { put } from "@utils/coreApiServices";
import { baseUrl } from "../../constant";
import { enqueueSnackbar } from "notistack";
const SubCategoryForm: React.FC<{
  handleClose: () => void;
  getSubCategories: (item: Record<string, any>, fromForm?: boolean) => void;
  parent: {
    show: boolean;
    name: string;
    id: string;
  };
}> = ({ parent, handleClose, getSubCategories }) => {
  const [editedData, setEditedData] = useState<{
    category_id: string;
    category_name: string;
  } | null>(null);
  const subcategoryData = useCategoryStore((state) => state.subcategoryData);

  const handleEdit = (item: { category_id: string; category_name: string }) => {
    setEditedData(item);
  };
  const handleSave = async () => {
    if (editedData) {
      const res = await put(
        `${baseUrl}product-management/api/update-category/`,
        editedData
      );
      if (res.status === 200) {
        enqueueSnackbar({ message: res.data.message, variant: "success" });
        setEditedData(null);
        getSubCategories({ categoryName: parent.name, categoryId: parent.id });
      } else {
        enqueueSnackbar({ message: res.data.message, variant: "error" });
        setEditedData(null);
      }
    }
  };

  return (
    
      <FormDialogue title={parent.name}>
        <div className="d-flex flex-column sub-category-form-wrapper">
          {subcategoryData?.map((item) => (
            <div
              className="d-flex align-center subcategory-list"
              key={item.category_id}
            >
              <div className="input-group d-flex align-center justify-between">
                <input
                  value={
                    editedData && item.category_id === editedData?.category_id
                      ? editedData.category_name
                      : item.category_name
                  }
                  disabled={item.category_id !== editedData?.category_id}
                  onChange={(e) =>
                    setEditedData({
                      category_id: item.category_id,
                      category_name: e.target.value,
                    })
                  }
                />
                <div
                  className="img"
                  onClick={(e) => {
                    e.preventDefault();
                    editedData ? handleSave() : handleEdit(item);
                  }}
                >
                  {editedData &&
                  item.category_id === editedData?.category_id ? (
                    <img src={SaveIcon} />
                  ) : (
                    <img src={EditIcon} />
                  )}
                </div>
              </div>
              <div className="img d-flex align-center justify-center">
                <img src={DeleteIcon} />
              </div>
              {/* {editedData.includes(item) ? (
              <>
                <input
                  value={item.category_name}
                  onChange={(e) => handleSave(e.target.value)}
                />
                <SaveIcon onClick={() => handleSave(item.category_name)} />
              </>
            ) : (
              <>
                <p>{item.category_name}</p>
                <DeleteIcon />
                <EditIcon onClick={() => handleEdit(item)} />
              </>
            )} */}
            </div>
          ))}
        </div>
        <div className="model-buttons d-flex ">
          <button className="button-delete" onClick={() => handleClose()}>
            Close
          </button>
        </div>
      </FormDialogue>
     
  );
};

export default SubCategoryForm;

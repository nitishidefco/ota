import React, {createContext, useState} from 'react';
export const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const [filter, setFilter] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  return (
    <FilterContext.Provider
      value={{
        filter,
        setFilter,
        showFilterModal,
        setShowFilterModal,
        selectedStars,
        setSelectedStars,
        selectedAmenities,
        setSelectedAmenities,
      }}>
      {children}
    </FilterContext.Provider>
  );
};

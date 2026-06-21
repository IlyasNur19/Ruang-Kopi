import React from 'react';
import TableNode from './TableNode';

const TableGrid = ({ tables, selectedId, onSelect, assigning }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => (
                <TableNode
                    key={table.id}
                    table={table}
                    isSelected={selectedId === table.id}
                    onSelect={onSelect}
                    disabled={assigning}
                />
            ))}
        </div>
    );
};

export default TableGrid;

import React from 'react';

import './index.css';

import {
	Column,
	Table as ReactTable,
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	ColumnDef,
	flexRender,
} from '@tanstack/react-table';

import '@components/card/index.css';
import '@components/table/index.css';
import '@components/table/ColumnTitle/index.css';
import '@components/table/Button/index.css';

import { makeData, Person } from './makeData';

export const TableComponent = () => {
	const rerender = React.useReducer(() => ({}), {})[1];

	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				id: 'title',
				footer: (props) => props.column.id,
				columns: [
					{
						accessorFn: (row) => row.firstName,
						accessorKey: 'firstName',
						cell: (info) => info.getValue(),
						header: () => <span className="ColumnTitle">First Name</span>,
						footer: (props) => props.column.id,
					},
					{
						accessorFn: (row) => row.lastName,
						id: 'lastName',
						cell: (info) => info.getValue(),
						header: () => <span className="ColumnTitle">Last Name</span>,
						footer: (props) => props.column.id,
					},
					{
						accessorKey: 'age',
						header: () => <span className="ColumnTitle">Age</span>,
						footer: (props) => props.column.id,
					},
					{
						accessorKey: 'visits',
						header: () => <span className="ColumnTitle">Visitors</span>,
						footer: (props) => props.column.id,
					},
					{
						accessorKey: 'status',
						header: () => <span className="ColumnTitle">Status</span>,
						footer: (props) => props.column.id,
					},
					{
						accessorKey: 'progress',
						header: () => <span className="ColumnTitle">Progress</span>,
						footer: (props) => props.column.id,
					},
				],
			},
		],
		[],
	);

	const [data, setData] = React.useState(() => makeData(100000));
	const refreshData = () => setData(() => makeData(100000));

	return (
		<>
			<Table
				{...{
					data,
					columns,
				}}
			/>

			<div>
				<button onClick={() => rerender()} className="TableButton">
					Force Rerender
				</button>
			</div>
			<div>
				<button onClick={() => refreshData()} className="TableButton">
					Refresh Data
				</button>
			</div>
		</>
	);
};

function Table({
	data,
	columns,
}: {
	data: Person[];
	columns: ColumnDef<Person>[];
}) {
	const table = useReactTable({
		data,
		columns,
		// Pipeline
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		//
		debugTable: true,
	});

	return (
		<div className="card">
			<div className="card-body">
				<div className="card-title-container">
					<div>
						<h3 className="card-title">Transactions</h3>
						<span className="card-subtitle">
							This is a list of latest transactions
						</span>
					</div>
				</div>
				<div className="table-container">
					<table>
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className={headerGroup.id === '0' ? 'hidden' : ''}
								>
									{headerGroup.headers.map((header) => {
										return (
											<th key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : (
													<div>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
														{header.column.getCanFilter() ? (
															<div>
																<Filter column={header.column} table={table} />
															</div>
														) : null}
													</div>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row, index) => {
								return (
									<tr
										key={row.id}
										className={index % 2 === 0 ? '' : 'striped-tr'}
									>
										{row.getVisibleCells().map((cell) => {
											return (
												<td key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="table-footer">
					<div>
						<div className="h-2" />
						<div className="arrow-buttons">
							<button
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								{'<<'}
							</button>
							<button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								{'<'}
							</button>
							<button
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								{'>'}
							</button>
							<button
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								{'>>'}
							</button>
							<span>
								<div>Page</div>
								<strong>
									{table.getState().pagination.pageIndex + 1} of{' '}
									{table.getPageCount()}
								</strong>
							</span>
							<span>
								| Go to page:
								<input
									type="number"
									defaultValue={table.getState().pagination.pageIndex + 1}
									onChange={(event) => {
										const page: number = event.target.value
											? Number(event.target.value) - 1
											: 0;
										table.setPageIndex(page);
									}}
								/>
							</span>
							<select
								value={table.getState().pagination.pageSize}
								onChange={(e) => {
									table.setPageSize(Number(e.target.value));
								}}
							>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										Show {pageSize}
									</option>
								))}
							</select>
						</div>
						<div className="hidden">
							<div className="text-gray-900 dark:text-white">
								{table.getRowModel().rows.length} Rows
							</div>
							<pre className="text-gray-900 dark:text-white">
								{JSON.stringify(table.getState().pagination, null, 2)}
							</pre>
						</div>
					</div>
					<div className="flex-shrink-0">
						<a
							href="#"
							className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
						>
							Transactions Report
							<svg
								className="w-4 h-4 ml-1 sm:w-5 sm:h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 5l7 7-7 7"
								></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
function Filter({
	column,
	table,
}: {
	column: Column<any, any>;
	table: ReactTable<any>;
}) {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id);

	const columnFilterValue = column.getFilterValue();

	return typeof firstValue === 'number' ? (
		<div className="flex space-x-2">
			<input
				type="number"
				value={((column.getFilterValue() as any)?.[0] ?? '') as string}
				onChange={(e) =>
					column.setFilterValue((old: any) => [e.target.value, old?.[1]])
				}
				placeholder={`Min`}
				className="filter-input"
			/>
			<input
				type="number"
				value={((column.getFilterValue() as any)?.[1] ?? '') as string}
				onChange={(e) =>
					column.setFilterValue((old: any) => [old?.[0], e.target.value])
				}
				placeholder={`Max`}
				className="filter-input"
			/>
		</div>
	) : (
		<input
			type="text"
			value={(columnFilterValue ?? '') as string}
			onChange={(e) => column.setFilterValue(e.target.value)}
			placeholder={`Search...`}
			className="filter-input"
		/>
	);
}

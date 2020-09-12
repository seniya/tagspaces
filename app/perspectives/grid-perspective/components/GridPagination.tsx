/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FileSystemEntry } from '-/services/utils-io';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import i18n from '-/services/i18n';
import { getCurrentDirectoryColor, isLoading } from '-/reducers/app';
import AppConfig from '-/config';

interface Props {
  className: string;
  style: Object;
  theme: any;
  // gridRef: Object;
  directories: Array<FileSystemEntry>;
  showDirectories: boolean;
  files: Array<FileSystemEntry>;
  renderCell: (FileSystemEntry) => void;
  currentDirectoryColor: string;
  isAppLoading: boolean;
  currentPage: number;
}

const GridPagination = (props: Props) => {
  const {
    className,
    style,
    theme,
    directories,
    showDirectories,
    renderCell,
    isAppLoading,
    currentDirectoryColor
  } = props;
  let { files, currentPage } = props;
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(props.currentPage);
  }, [props.currentPage]);

  const handleChange = (event, value) => {
    // props.currentPage = value;
    setPage(value);
  };

  const pageLimit = 10;
  let paginationCount = 10;

  let showPagination = false;
  if (files.length > pageLimit) {
    paginationCount = Math.ceil(files.length / pageLimit);
    const start = (page - 1) * pageLimit;
    files = files.slice(start, start + pageLimit);
    showPagination = true;
  }

  return (
    <div
      style={{
        height: '100%',
        backgroundColor: theme.palette.background.default
      }}
    >
      <div
        style={{
          height: '100%',
          // @ts-ignore
          overflowY: AppConfig.isFirefox ? 'auto' : 'overlay',
          backgroundColor: currentDirectoryColor || 'transparent'
        }}
      >
        <div
          className={className}
          style={style}
          /*ref={ref => {
            gridRef = ref;
          }}*/
          data-tid="perspectiveGridFileTable"
        >
          {page === 1 && directories.map(entry => renderCell(entry))}
          {files.map(entry => renderCell(entry))}
          {isAppLoading && (
            <Typography style={{ padding: 15 }}>
              {i18n.t('core:loading')}
            </Typography>
          )}
          {!isAppLoading && files.length < 1 && directories.length < 1 && (
            <Typography style={{ padding: 15 }}>
              {i18n.t('core:noFileFolderFound')}
            </Typography>
          )}
          {!isAppLoading &&
            files.length < 1 &&
            directories.length >= 1 &&
            !showDirectories && (
              <Typography style={{ padding: 15 }}>
                {i18n.t('core:noFileButFoldersFound')}
              </Typography>
            )}
        </div>
        {showPagination && (
          <p style={{ marginTop: '-180px' }}>
            {/*<Typography>Page: {page}</Typography>*/}
            <Pagination
              count={paginationCount}
              page={page}
              onChange={handleChange}
            />
          </p>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isAppLoading: isLoading(state),
    currentDirectoryColor: getCurrentDirectoryColor(state)
  };
}

export default connect(mapStateToProps)(GridPagination);
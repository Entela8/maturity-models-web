import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#5B5BD6',
          color: '#E0DFFE',
          '&:hover': {
            backgroundColor: '#6E6ADE',
          },
          textTransform: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#202248',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#202248",
          borderRadius: 20
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#B1A9FF",
          borderColor: "#3D3E82"
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderColor: "#3D3E82"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-brandBorderColor': '#E0DFFE',
          '--TextField-brandBorderHoverColor': '#E0DFFE',
          '--TextField-brandBorderFocusedColor': '#E0DFFE',
          '& label.Mui-focused': {
            color: '#E0DFFE',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '&:before, &:after': {
            borderBottom: '2px solid #4A4A95',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '2px solid #5958B1',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid #5958B1',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: 'transparent',
          color: '#E0DFFE',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B1A9FF'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#202248'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#5B5BD6'
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#202248',
          '&:hover': {
            backgroundColor: '#262A65'
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#303374',
          fontWeight: 'bold'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#303374',
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          backgroundColor: '#303374',
          color: '#E0DFFE',
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: '#303374',
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: '#3D3E82'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#E0DFFE',
          '&.Mui-selected': {
            color: '#B1A9FF',
          },
        },
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#4A4A95',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4A4A95',
            },
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5958B1',
          },
        },
        notchedOutline: {
          borderColor: '#4A4A95',
        },
      },
    },
  },
});

export default theme

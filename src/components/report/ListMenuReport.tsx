import ContentMain from "../content/Content";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function ListMenuReport() {
  const navigate = useNavigate();
  return (
    <ContentMain>
      <Grid container spacing={3} className="pt-7">
        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="/report/attendance"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 11, sm: 11, md: 11, lg: 16 },
              }}
            >
              児童出席簿
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="/report/attendancemonth"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 11, sm: 11, md: 11, lg: 16 },
              }}
            >
              月 児童出席簿 組
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            onClick={() => navigate("/report/overallplan")}
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 11, sm: 11, md: 11, lg: 16 },
              }}
            >
              全体計画
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="/report/annualplan"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 11, sm: 11, md: 11, lg: 16 },
              }}
            >
              年間指導計画
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="/report/monthlyplan"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 11, sm: 11, md: 11, lg: 16 },
              }}
            >
              月指導計画
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="report/weeklyplan"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 10, sm: 10, md: 10, lg: 14 },
              }}
            >
              週案と保育日誌(未満児)
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={3}>
          <Button
            variant="contained"
            href="/report/carediary"
            className="w-full h-10"
          >
            <Typography
              component="div"
              sx={{
                color: "white",
                paddingLeft: "10px",
                fontSize: { xs: 10, sm: 10, md: 10, lg: 14 },
              }}
            >
              個人カリキュラム・記録
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </ContentMain>
  );
}
